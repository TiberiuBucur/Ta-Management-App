import { Pool } from "pg";
import { Slot } from "../Slot";

// Only to be used when first instantiating the mock ta_schedule for the first time
// on a new platform
import { createAllTables, mockDataForTables } from "./initsAndMocks";


const prodMode = process.env.DATABASE_URL !== undefined;
console.log(`PRODUCTION MODE: ${prodMode}`);

export const TAS_SCHEDULE_TABLE: string = "tas_schedule";
export const LAB_SLOTS_TABLE: string = "lab_slots";

class Postgre {

  public pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async setAvailability(username: any, availability: any): Promise<any> {
    const isSet = await this.hasAvailability(username);
    const stringAvail = JSON.stringify(availability);
    return isSet ? pool.query("UPDATE tas SET availability = $1 WHERE username = $2", [stringAvail, username])
      : pool.query("INSERT INTO tas (username, availability) VALUES($1, $2)", [username, stringAvail]);
  }

  public async hasAvailability(username: any): Promise<boolean> {
    const qresult = await pool.query("SELECT * FROM tas where username = $1", [username]);
    return qresult.rows.length !== 0;
  }

  public async getAvailability(shortcode: string): Promise<[any[] | null, object | null]> {
    const q = `SELECT * FROM ${TAS_SCHEDULE_TABLE} WHERE shortcode = '${shortcode}';`
    console.log(`query: ${q}`);

    return pool.query(`SELECT * FROM ${TAS_SCHEDULE_TABLE} WHERE shortcode = '${shortcode}';`)
      .then(res => {
        if (!res || !(res.rows) || res.rows.length === 0) {
          return [null, null];
        }

        let nextSession: Date | null = null;
        let closestTime = -1;
        const now = Date.now();

        res.rows.forEach(slot => {
          const date = new Date(slot.time);
          if (!nextSession) {
            nextSession = date;
          } else {
            const diff = nextSession.getTime() - now;
            if (diff > closestTime) {
              closestTime = diff;
              nextSession = date;
            }
          }

          slot.date = {
            day: date.getDate(),
            month: date.getUTCMonth() + 1,
            year: date.getUTCFullYear()
          };
          if (!(slot.assignment === "backup" || slot.assignment === "none")) {
            // the assignment is a number
            slot.assignment = Number(slot.assignment);
          }
          delete slot.time;
        });

        let nextSess: object | null = null;
        if (closestTime !== -1) {
          nextSess = {
            day: nextSession.getUTCDate(),
            month: nextSession.getUTCMonth() + 1,
            year: nextSession.getUTCFullYear()
          };
        }

        return [res.rows, nextSess];
      });
  }

  public async getUserRow(username: any): Promise<any> {
    const qresult = await pool.query("SELECT * FROM tas WHERE username = $1", [username]);
    return qresult.rows[0];
  }

  public async setSessions(slots: Slot[]) {
    // Clears old sessions from database. TODO: change this if necessary
    await pool.query(`DELETE FROM ${LAB_SLOTS_TABLE}`);

    slots.forEach(async (slot: Slot) => {
      const { date, startH, endH, term } = slot;
      await pool.query(
        `INSERT INTO ${LAB_SLOTS_TABLE} (date, startH, endH, term) VALUES($1, $2, $3, $4)`,
        [`${date.year}-${date.month}-${date.day}`, startH, endH, term]
      );
    });
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

const postgre = new Postgre(pool);


export { postgre, pool };
