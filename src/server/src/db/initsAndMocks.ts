import { LAB_SLOTS_TABLE, TAS_SCHEDULE_TABLE, pool } from "./postgre";

async function logTasScheduleTable(): Promise<void> {
  return pool.query('SELECT * from ${TAS_SCHEDULE_TABLE}').then(r => console.log(r)).catch(err => console.log(err));
}

async function mockDataForTables(): Promise<void> {
  try {
    await mockLabSlots();
    await mockTasSchedule();
  } catch (err) {
    console.log("Failed to mock data for all tables");
  }
  
}

async function mockLabSlots(): Promise<void> {
  try {
    // Introduce 5 mock lab slots in database
  } catch (err) {

  }
}


async function createLabSlotsTable(): Promise<void> {
  const createQ = `CREATE TABLE ${LAB_SLOTS_TABLE} (id SERIAL PRIMARY KEY, date DATE, startH TIME, endH TIME, term SMALLINT);`;
  await createTable(createQ, LAB_SLOTS_TABLE);
}

async function createAllTables() {
  try {
    await createLabSlotsTable();
    await createTasScheduleTable();
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
  const createTableQ = `create table ${TAS_SCHEDULE_TABLE} (id SERIAL PRIMARY KEY, shortcode VARCHAR(25), term SMALLINT, \
                                                  assignment VARCHAR(10), slot_id INT REFERENCES ${LAB_SLOTS_TABLE}(id), status VARCHAR(100));`;
  await createTable(createTableQ, TAS_SCHEDULE_TABLE);
}

// Makes a new database called 'tas_schedule' and puts mock data into it
async function mockTasSchedule(): Promise<void> {
   try { 
     console.log("Introducing mock data to tas_schedule table");
     // await introduceMockData(); 
     console.log("Introduced data successfully");
     console.log("Printing what we introduced:");
     await logTasScheduleTable();
   }
   catch (err) { console.log(err); };
}

/*
 * Introduces 10 mock slots
 */
async function introduceMockData(): Promise<void> {
  // TODO(radu): Make it consistent with the new table
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
      return `INSERT INTO ${TAS_SCHEDULE_TABLE} (shortcode, term, time, start_hour, end_hour, assignment, status) VALUES ('${shortcode}${i}', ${term}, '${dbDate}', '${start}', '${end}', '${assignment}', '${status}');`;
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


export { createAllTables, mockDataForTables };
 
