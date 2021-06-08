import { pool } from "./postgre";
/*
 * Command used to create tas_schedule table:
 * create table tas_schedule (slot_id SERIAL PRIMARY KEY, shortcode VARCHAR(25), term SMALLINT, time DATE, start_hour VARCHAR(5), end_hour VARCHAR(5), assigned SMALLINT, status VARCHAR(100));
 *
 */


const tasScheduleTable = "tas_schedule";

async function logTasScheduleTable(): Promise<void> {
  return pool.query("SELECT * from tas_schedule").then(r => console.log(r)).catch(err => console.log(err));
}

// Makes a new database called 'tas_schedule' and puts mock data into it
async function createMockTAScheduleData(): Promise<void> {
  const createTableQ = "create table tas_schedule (slot_id SERIAL PRIMARY KEY, shortcode VARCHAR(25), term SMALLINT, time DATE, start_hour VARCHAR(5), end_hour VARCHAR(5), assignment VARCHAR(10), status VARCHAR(100));";
   try { console.log("Creating tas_schedule table"); 
     await pool.query(createTableQ); 
     console.log("Table creation successful");
     console.log("Introducing mock data to tas_schedule table");
     await introduceMockData(); 
     console.log("Introduced data successfully");
     console.log("Printing what we introduced:");
     await logTasScheduleTable();
   }
   catch (err) { console.log(err) };
}

/*
 * Introduces 10 mock slots
 */
async function introduceMockData(): Promise<void> {
  const shortcode = "testsc";
  const term = 3;
  const date = new Date("2021-06-17");
  for (let i = 0; i < 5; i++) {
    const status = mockStatus(i);
    let assignment = i % 2 == 0 ? "2" : "backup"; // Assign channel 2 to some slots
    if (i % 3 == 0) {
      assignment = "none";
    }
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + i * 3);
    const dbDate = `${newDate.getUTCFullYear()}-${newDate.getUTCMonth()+1}-${newDate.getUTCDate()}`;
    const createQ = (first: boolean) =>  {
      const start = first ? '11:00' : '12:00';
      const end = first ? '12:00' : '13:00';
      return `INSERT INTO ${tasScheduleTable} (shortcode, term, time, start_hour, end_hour, assignment, status) VALUES ('${shortcode}${i}', ${term}, '${dbDate}', '${start}', '${end}', '${assignment}', '${status}');`;
    }

    let firstq = createQ(true);
    let secondq = createQ(false);
    try { await pool.query(firstq); await pool.query(secondq); }
    catch (err) {  console.log(err) };
  }
  
}

function mockStatus(i: number): string | null {
  switch (i) {
    case 0: return "CLAIMED";
    case 1: return "READY_TO_CLAIM";
    case 2: return "MISSED";
    case 3: return "ASSIGNED";
    case 4: return "NEXT"; 
    default : return null; // In case we add more than 10 mocked dates
  }
}


export { createMockTAScheduleData };
 
