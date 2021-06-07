import { Pool } from "pg";
// Only to be used when first instantiating the mock ta_schedule for the first time
// on a new platform
import { createMockTAScheduleData } from "./mocktaSchedule";

const prodMode = process.env.DATABASE_URL !== undefined;
console.log(`PRODUCTION MODE: ${prodMode}`);

const tasScheduleTable: string = "tas_schedule";

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

  public async getAvailability(shortcode: string): Promise<any | null> {
    const q = `SELECT * FROM ${tasScheduleTable} WHERE shortcode = '${shortcode}';`
    console.log(`query: ${q}`);
    return pool.query(`SELECT * FROM ${tasScheduleTable} WHERE shortcode = '${shortcode}';`)
    .then(res => { 
      if (!res || !(res.rows)) {
          return null;
      }
      res.rows.forEach(slot => {
          const date = new Date(slot.time);
          slot.date = { day: date.getDate(), month: date.getUTCMonth() + 1, year: date.getUTCFullYear() };
          delete slot.time; 
      });
      return res.rows;
    });
  }

  public async getUserRow(username: any): Promise<any> {
    const qresult = await pool.query("SELECT * FROM tas WHERE username = $1", [username]);
    return qresult.rows[0];
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
