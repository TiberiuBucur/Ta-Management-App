import {
  LAB_SLOTS_TABLE,
  TAS_SCHEDULE_TABLE,
  TAS_TABLE,
  pool,
  postgre,
  RECURRING_SLOTS_TABLE,
  TAS_AVAILABILITIES_TABLE,
} from "./postgre";
import { RecurringSlot, Slot, DbSlot, Priority, Availability, DbRecurringSlot, SlotStatus } from "../Slot";
import { assert } from "console";
import { NONAME } from "dns";

async function logTasScheduleTable(): Promise<void> {
  return await pool
    .query(`SELECT * from ${TAS_SCHEDULE_TABLE}`)
    .then((r) => console.log(r))
    .catch((err) => console.log(err));
}

async function mockDataForTables(): Promise<void> {
  try {
    await mockLabSlots();
    await mockTasSchedule();
  } catch (err) {
    console.log("Failed to mock data for all tables");
  }
}

// Add dummy values to the lab slots table in the DB.
export async function mockLabSlots(): Promise<void> {
  const term: number = 3;
  const startH: string = "12:00";
  const endH: string = "13:00";
  var date: Date = new Date("2021-6-15");

  const sessions: Slot[] = [];
  const sessionsNumber: number = 10;
  const offset: number = 7;

  for (let i = 0; i < sessionsNumber; i++) {
    sessions.push({ term, startH, endH, date });
    date = new Date(date);
    date.setDate(date.getDate() + offset);
  }

  try {
    await postgre.setSessions(sessions);
  } catch (err) {
    console.log(err);
  }
}

async function createLabSlotsTable(): Promise<void> {
  const createQ: string = `CREATE TABLE ${LAB_SLOTS_TABLE} (id SERIAL PRIMARY KEY, date DATE, startH TIME, endH TIME, term SMALLINT);`;
  await createTable(createQ, LAB_SLOTS_TABLE);
}

async function createRecurringSlotsTable(): Promise<void> {
  const createQ: string = `CREATE TABLE ${RECURRING_SLOTS_TABLE} (id SERIAL PRIMARY KEY, day VARCHAR(10), startH TIME, endH time);`;
  await createTable(createQ, RECURRING_SLOTS_TABLE);
}

async function createTaAvailabilitiesTable(): Promise<void> {
  const createQ: string = `CREATE TABLE ${TAS_AVAILABILITIES_TABLE} (id SERIAL PRIMARY KEY, shortcode VARCHAR(30), priority SMALLINT, \
    recurring_id INT REFERENCES ${RECURRING_SLOTS_TABLE}(id));`;
  await createTable(createQ, TAS_AVAILABILITIES_TABLE);
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export async function mockTasAvailabilities(): Promise<void> {
  const numUsers: number = 70;
  // 3 zile si 4 * 3 * 2 optiuni
  const options: number[][] = [
    [Priority.MAX, Priority.MID, Priority.LOW],
    [Priority.LOW, Priority.MID, Priority.MAX],
    [Priority.NONE, Priority.MAX, Priority.MID],
    [Priority.MID, Priority.MAX, Priority.LOW],
    [Priority.MAX, Priority.NONE, Priority.MID],
    [Priority.NONE, Priority.MAX, Priority.MID],
    [Priority.NONE, Priority.MID, Priority.MAX],
    [Priority.LOW, Priority.MID, Priority.MAX],
    [Priority.MID, Priority.NONE, Priority.MAX],
    [Priority.NONE, Priority.NONE, Priority.MAX],
    [Priority.NONE, Priority.MAX, Priority.NONE],
    [Priority.MAX, Priority.NONE, Priority.NONE],
  ];

  console.log("Trying to add availability mocks");

  const optsLen: number = options.length;
  for (let i = 0; i < numUsers; i++) {
    const config = getRandomInt(optsLen);
    const createQ = (recurring_id) => {
      return `INSERT INTO ${TAS_AVAILABILITIES_TABLE} (shortcode, priority, recurring_id) \
              VALUES ('ta_${i}', ${
        options[config][recurring_id - 1]
      }, ${recurring_id})`;
    };
    try {
      for (let j = 1; j <= 3; j++) {
        const query: string = createQ(j);
        await pool.query(query);
      }
    } catch (err) {
      console.log(err);
      return;
    }
  }
  console.log("Added availabilities mocks successfully");
}

async function createAllTables(): Promise<void> {
  try {
    await createLabSlotsTable();
    await createTasTable();
    await createTasScheduleTable();
    await createRecurringSlotsTable();
    await createTaAvailabilitiesTable();
    console.log("Creation of all tables succesful!");
  } catch (err) {
    console.log("Creating all of the tables failed");
  }
}

async function createTable(createQ: string, tableName: string): Promise<void> {
  console.log(`Creating table ${tableName}`);
  try {
    await pool.query(createQ);
    console.log(`Creation of table ${tableName} was succesful`);
  } catch (err) {
    console.log(`Creating table ${tableName} failed for reason: `);
    console.log(err);
  }
}

async function createTasScheduleTable(): Promise<void> {
  const createTableQ = `CREATE TABLE ${TAS_SCHEDULE_TABLE} (id SERIAL PRIMARY KEY, \
                        shortcode VARCHAR(25), slot_id INT REFERENCES ${LAB_SLOTS_TABLE}(id), \
                        assignment VARCHAR(10), status VARCHAR(100));`;
  await createTable(createTableQ, TAS_SCHEDULE_TABLE);
}

async function createTasTable(): Promise<void> {
  const createTableQ = `CREATE TABLE ${TAS_TABLE} (shortcode VARCHAR(25) PRIMARY KEY);`;
  await createTable(createTableQ, TAS_TABLE);
}

// Makes a new database called 'tas_schedule' and puts mock data into it
async function mockTasSchedule(): Promise<void> {
  try {
    console.log("Introducing mock data to tas_schedule table");
    await mockTasScheduleHelper();
    console.log("Introduced data successfully");
    console.log("Printing what we introduced:");
    await logTasScheduleTable();
  } catch (err) {
    console.log(err);
  }
}

/*
 * Introduces 10 mock slots
 */
async function mockTasScheduleHelper(): Promise<void> {
  const shortcode = "testsc";
  const slotsIds = await postgre.getLabSlotsIds();
  console.log(slotsIds);

  for (let i = 0; i < slotsIds.length; i++) {
    const status = mockStatus(i);
    let assignment = i % 2 == 0 ? "2" : "backup"; // Assign channel 2 to some slots
    if (i % 3 == 0) {
      assignment = "none";
    }
    const createQ = (slotId: number) => {
      return `INSERT INTO ${TAS_SCHEDULE_TABLE} (shortcode, slot_id, assignment, status) \
              VALUES ('${shortcode}${i}', ${slotId}, '${assignment}', '${status}');`;
    };

    try {
      const r = createQ(slotsIds[i].id);
      const other = i === slotsIds.length - 1 ? i - 1 : i + 1;
      const r2 = createQ(slotsIds[other].id);
      console.log(r);
      await pool.query(r);
      await pool.query(r2);
    } catch (err) {
      console.log(err);
    }
  }
}

function mockStatus(i: number): string | null {
  switch (i) {
    case 0:
      return "CLAIMED";
    case 1:
      return "READY_TO_CLAIM";
    case 2:
      return "MISSED";
    case 3:
      return "ASSIGNED";
    case 4:
      return "NEXT";
    default:
      return "ASSIGNED"; // In case we add more than 5 mocked dates
  }
}

function numberNones(a: Availability[], noSessions: number) {
  let res = 0;
  for (let i = 0; i < noSessions; i++) {
    if (a[i].priority === Priority.NONE) {
      res++;
    }
  }
  return res;
}

export async function makeTasSchedule() {
  const recurring_slots: DbRecurringSlot[] =
    await postgre.getRecurringSlotsData();
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
    const diff = numberNones(a, noSessions) - numberNones(b, noSessions);
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
  await updateSchedule(availabilities, recurring_slots);
}


const daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

async function updateSchedule(availabilities: Availability[][], recurringSlots: DbRecurringSlot[]): Promise<void> {
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
    const dow: string = daysOfWeek[sl.date.getUTCDay()];
    const matchingId: DbRecurringSlot[] = recurringSlots.filter(s => s.day === dow);
    if (matchingId.length === 1) {
      slotsForDay[matchingId[0].id.toString()].push(sl.id);
    } else {
      console.log(`No matching recurring day of the week found for calendar date: \
                  ${sl.date.toString()}. Possible error!`);
    }
  });

  console.log(slotsForDay);

  for (const taAvails  of availabilities) {
    for (const av of taAvails) {
      // The slot_ids from table 'lab_slots' which we want to set with av.priority;
      const slotsToSet: number[] = slotsForDay[av.recurring_id.toString()];
      for (const slot_id of slotsToSet) {
        let status: SlotStatus;
        if ((typeof av.assigned) === "number") {
          // We got an assignment
          status = "ASSIGNED";
        } else {
          // Must be either backup or unavailable for given slot
          status = "UNAVAILABLE";
        }
        await postgre.assignTaToSlot(av.shortcode, slot_id, av.assigned, status);
      }
    }
  }
  console.log("Finished assigning all tas their respective slots in the database");
}

export { createAllTables, mockDataForTables };
