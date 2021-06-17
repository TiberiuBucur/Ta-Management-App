import { Pool } from "pg";
import {
  Availability,
  DbRecurringSlot,
  RecurringSlot,
  recurringSlotFromString,
  Slot,
  DbSlot,
  slotFromJson,
  SlotAssignment,
  SlotStatus,
  Priority,
} from "../Slot";
import {
  createAllTables,
  mockDataForTables,
  mockTasAvailabilities,
} from "./initsAndMocks";

const prodMode = process.env.DATABASE_URL !== undefined;
console.log(`PRODUCTION MODE: ${prodMode}`);

export const TAS_SCHEDULE_TABLE: string = "tas_schedule";
export const LAB_SLOTS_TABLE: string = "lab_slots";
export const TAS_TABLE: string = "tas_table";
export const RECURRING_SLOTS_TABLE: string = "recurring_slots";
export const TAS_AVAILABILITIES_TABLE: string = "tas_availabilities";

type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

function dayOfWeekFromNumber(d: number): DayOfWeek {
  switch (d) {
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    case 7:
      return "Sunday";
  }
}

class Postgre {
  public pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async setAvailability(username: any, availability: any): Promise<any> {
    const isSet = await this.hasAvailability(username);
    const stringAvail = JSON.stringify(availability);
    return isSet
      ? pool.query("UPDATE tas SET availability = $1 WHERE username = $2", [
          stringAvail,
          username,
        ])
      : pool.query("INSERT INTO tas (username, availability) VALUES($1, $2)", [
          username,
          stringAvail,
        ]);
  }

  public async hasAvailability(username: any): Promise<boolean> {
    const qresult = await pool.query("SELECT * FROM tas where username = $1;", [
      username,
    ]);
    return qresult.rows.length !== 0;
  }

  // TODO: fix nextsession.
  public async getAvailability(
    shortcode: string
  ): Promise<[any[] | null, object | null]> {
    return await pool
      .query(
        `SELECT shortcode, slot_id, assignment, status, date, starth AS start_hour, endh AS end_hour, term \
        FROM tas_schedule JOIN lab_slots ON tas_schedule.slot_id = lab_slots.id \
        WHERE shortcode = $1;`,
        [shortcode]
      )
      .then(res => {
        if (!res || !res.rows || res.rows.length === 0) {
          return [null, null];
        }

        let nextSession: Date | null = null;
        let closestTime = Number.MAX_VALUE;
        const now = Date.now();

        // The times from the database are assumed to be UTC, but js's Date()
        // assumes we are constructing local time, so we need to add the UTC offset (in case the server
        // is running somewhere with no UTC) for accurate times
        const _ofs = new Date();
        const ofs = -_ofs.getTimezoneOffset() * 60000; // Offset in miliseconds from UTC

        res.rows.forEach(slot => {
          const date = new Date(new Date(slot.date).getTime() + ofs); // Construct UTC date
          const diff = date.getTime() - now;
          if (diff < closestTime) {
            closestTime = diff;
            nextSession = date;
          }

          slot.day = dayOfWeekFromNumber(date.getUTCDay());
          slot.date = {
            day: date.getDate(),
            month: date.getUTCMonth() + 1,
            year: date.getUTCFullYear(),
          };
          if (!(slot.assignment === "backup" || slot.assignment === "none")) {
            // the assignment is a number
            slot.assignment = Number(slot.assignment);
          }
        });

        let nextSess: object | null = null;
        if (closestTime !== Number.MAX_VALUE) {
          nextSess = {
            day: nextSession.getUTCDate(),
            month: nextSession.getUTCMonth() + 1,
            year: nextSession.getUTCFullYear(),
          };
        }

        return [res.rows, nextSess];
      });
  }

  public async getUserRow(username: any): Promise<any> {
    const qresult = await pool.query("SELECT * FROM tas WHERE username = $1;", [
      username,
    ]);
    return qresult.rows[0];
  }

  public async getRecurring(): Promise<string[]> {
    let recs: any = [];
    try {
      recs = await pool.query(
        `SELECT day, startH, endH FROM ${RECURRING_SLOTS_TABLE};`
      );
    } catch (err) {
      console.log(err);
      return;
    }
    return recs.rows.map(rec => {
      return `${rec.day} ${rec.starth} - ${rec.endh}`;
    });
  }

  public async assignTaToSlot(
    shortcode: string,
    slotId: number,
    assignment: SlotAssignment,
    status: SlotStatus
  ): Promise<void> {
    try {
      await pool.query(
        `INSERT INTO ${TAS_SCHEDULE_TABLE} (shortcode, slot_id, assignment, status) VALUES ($1, $2, $3, $4);`,
        [shortcode, slotId, assignment, status]
      );
    } catch (err) {
      console.log(`Error assigning ta ${shortcode} to slot ${slotId}:`);
      console.log(err);
    }
  }

  public async getLabSlots(): Promise<DbSlot[]> {
    try {
      /* What we get back from postgres is a Date object, but node assumes we are using
       * local times instead of UTC, so we need to transform them to UTC. */
      const ofs: number = -new Date().getTimezoneOffset() * 60_000;
      const res: any = await pool.query("SELECT * FROM lab_slots;");
      (res.rows || []).forEach((s: Slot) => {
        const d: Date = s.date;
        const actualDate: Date = new Date(d.getTime() + ofs);
        s.date = actualDate;
        console.log(s.date);
        console.log(actualDate);
      });
      return res.rows;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  public async getRecurringSlotsData(): Promise<DbRecurringSlot[]> {
    let recs: any = [];
    try {
      recs = await pool.query(`SELECT * FROM ${RECURRING_SLOTS_TABLE};`);
    } catch (err) {
      console.log(err);
      return;
    }
    return recs.rows.map(rec => {
      return {
        id: rec.id,
        day: rec.day,
        startH: rec.starth,
        endH: rec.endh,
      };
    });
  }

  public async getAvailabilites(): Promise<Availability[]> {
    let recs: any = [];
    try {
      recs = await pool.query(
        `SELECT shortcode, priority, recurring_id FROM ${TAS_AVAILABILITIES_TABLE} ORDER BY shortcode, priority;`
      );
    } catch (err) {
      console.log(err);
      return;
    }
    return recs.rows.map(rec => {
      return {
        shortcode: rec.shortcode,
        priority: rec.priority,
        recurring_id: rec.recurring_id,
        assigned: "none",
      };
    });
  }

  public async setRecurring(recurrings: RecurringSlot[]): Promise<void> {
    try {
      for (const rec of recurrings) {
        await pool.query(
          `INSERT INTO ${RECURRING_SLOTS_TABLE} (day, startH, endH) VALUES ($1, $2, $3);`,
          [rec.day, rec.startH, rec.endH]
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  public async setSessions(slots: Slot[]): Promise<void> {
    // Clears old sessions from database. TODO: change this if necessary
    await pool.query(`DELETE FROM ${TAS_SCHEDULE_TABLE}`);
    await pool.query(`DELETE FROM ${LAB_SLOTS_TABLE}`);
    await pool.query(`DELETE FROM ${RECURRING_SLOTS_TABLE}`);

    console.log(slots);
    for (const slot of slots) {
      const { date, startH, endH, term } = slot;

      await pool.query(
        `INSERT INTO ${LAB_SLOTS_TABLE} (date, startH, endH, term) VALUES($1, $2, $3, $4);`,
        [
          `${date.getUTCFullYear()}-${
            date.getUTCMonth() + 1
          }-${date.getUTCDate()}`,
          startH,
          endH,
          term,
        ]
      );
    }
  }

  public async getLabSlotsIds(): Promise<any> {
    try {
      const res = await pool.query(`SELECT id FROM lab_slots;`);
      return res.rows;
    } catch (err) {
      console.log(err);
    }

    return [];
  }

  private static numberNones(a: Availability[], noSessions: number) {
    let res = 0;
    for (let i = 0; i < noSessions; i++) {
      if (a[i].priority === Priority.NONE) {
        res++;
      }
    }
    return res;
  }

  public async makeTasSchedule() {
    const recurring_slots: DbRecurringSlot[] = await postgre.getRecurringSlotsData();
    const recs: Availability[] = await postgre.getAvailabilites();
    const noSessions = recurring_slots.length;

    const noTAs = recs.length / noSessions;

    let availabilities: Availability[][] = new Array<Availability[]>(noTAs);

    for (let i = 0; i < noTAs; i++) {
      availabilities[i] = new Array<Availability>(noSessions);
    }

    const tasPerSession = Math.floor(noTAs / noSessions);
    let leftOverSlots = noTAs - tasPerSession * noSessions;

    availabilities[0][0] = recs[0];
    let bucket = 0;
    let pos = 0;
    for (let i = 1; i < recs.length; i++) {
      if (recs[i].shortcode !== recs[i - 1].shortcode) {
        bucket++;
        pos = 0;
      } else {
        pos++;
      }
      availabilities[bucket][pos] = recs[i];
    }

    availabilities.sort((a, b) => {
      const diff =
        Postgre.numberNones(a, noSessions) - Postgre.numberNones(b, noSessions);
      if (diff === 0) {
        return Math.random() - 0.5;
      }
      return -diff;
    });

    let slotsFree: number[] = new Array<number>(noSessions);
    const totalSlotsFree = () => {
      let res = 0;
      for (let i = 0; i < noSessions; i++) {
        res += slotsFree[i];
      }
      return res;
    };

    for (let i = 0; i < noSessions; i++) {
      if (leftOverSlots > 0) {
        slotsFree[i] = tasPerSession + 1;
        leftOverSlots--;
      } else {
        slotsFree[i] = tasPerSession;
      }
    }

    let hasBackup: boolean[] = new Array<boolean>(noTAs);
    let priCrt: number[] = new Array<number>(noTAs);
    for (let i = 0; i < noTAs; i++) {
      hasBackup[i] = false;
      priCrt[i] = 0;
    }

    while (totalSlotsFree() > 0) {
      for (let i = 0; i < noTAs; i++) {
        let j = priCrt[i];
        const avail = availabilities[i];
        while (
          j < noSessions &&
          avail[j].priority !== Priority.NONE &&
          slotsFree[avail[j].recurring_id - 1] === 0
        ) {
          if (!hasBackup[i]) {
            // only one backup per week is allowed to every student
            avail[j].assigned = "backup";
            hasBackup[i] = true;
          }
          j++;
        }

        if (j < noSessions && avail[j].priority !== Priority.NONE) {
          let rec_id = avail[j].recurring_id - 1;
          avail[j].assigned = slotsFree[rec_id];
          slotsFree[rec_id]--;
          j++;
        }
        priCrt[i] = j;
      }
    }

    let ok = true;
    for (let i = 0; i < noTAs; i++) {
      let assigned = 0;
      for (let j = 0; j < noSessions; j++) {
        if (
          availabilities[i][j].assigned !== "none" &&
          availabilities[i][j].assigned !== "backup"
        ) {
          assigned++;
        }
      }
      if (assigned !== 1) {
        ok = false;
        break;
      }
    }
    await this.updateSchedule(availabilities, recurring_slots);
  }
  private static daysOfWeek: string[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  private async updateSchedule(
    availabilities: Availability[][],
    recurringSlots: DbRecurringSlot[]
  ): Promise<void> {
    /* "availabilities" tells us what each user got for each lab day,
     * so all we have to do is check what lab day each slot is
     */
    const labSlots: DbSlot[] = await postgre.getLabSlots();
    console.log(labSlots);

    /* Map[RecurringSlot.id, Slot.id[]] which where slotsForDay[recurring.id] contains
   contains a list of which actual lab slots are associated with that specific recurring slot id */
    const slotsForDay: object = {};

    recurringSlots.forEach(sl => {
      slotsForDay[sl.id.toString()] = [];
    });

    labSlots.forEach(sl => {
      const dow: string = Postgre.daysOfWeek[sl.date.getUTCDay()];
      const matchingId: DbRecurringSlot[] = recurringSlots.filter(
        s => s.day === dow
      );
      if (matchingId.length === 1) {
        slotsForDay[matchingId[0].id.toString()].push(sl.id);
      } else {
        console.log(`No matching recurring day of the week found for calendar date: \
                  ${sl.date.toString()}. Possible error!`);
      }
    });

    console.log(slotsForDay);

    for (const taAvails of availabilities) {
      for (const av of taAvails) {
        // The slot_ids from table 'lab_slots' which we want to set with av.priority;
        const slotsToSet: number[] = slotsForDay[av.recurring_id.toString()];
        for (const slot_id of slotsToSet) {
          let status: SlotStatus;
          if (typeof av.assigned === "number") {
            // We got an assignment
            status = "ASSIGNED";
          } else {
            // Must be either backup or unavailable for given slot
            status = "UNAVAILABLE";
          }
          await postgre.assignTaToSlot(
            av.shortcode,
            slot_id,
            av.assigned,
            status
          );
        }
      }
    }
    console.log(
      "Finished assigning all tas their respective slots in the database"
    );
  }
}

const pool: Pool = prodMode
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    })
  : new Pool({
      user: "postgres",
      host: "localhost",
      database: "testdb",
      password: "fghijbon8976",
      port: 5432,
    });

const postgre: Postgre = new Postgre(pool);

export { postgre, pool };
