import { LAB_SLOTS_TABLE, TAS_SCHEDULE_TABLE, TAS_TABLE, pool, postgre } from "./postgre";
import { Slot } from "../Slot";


async function logTasScheduleTable(): Promise<void> {
  return await pool.query(`SELECT * from ${TAS_SCHEDULE_TABLE}`).then(r => console.log(r)).catch(err => console.log(err));
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
  const startH: string = '12:00';
  const endH: string = '13:00';
  var date: Date = new Date('2021-6-15');

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
  const createQ = `CREATE TABLE ${LAB_SLOTS_TABLE} (id SERIAL PRIMARY KEY, date DATE, startH TIME, endH TIME, term SMALLINT);`;
  await createTable(createQ, LAB_SLOTS_TABLE);
}

async function createAllTables() {
  try {
    await createLabSlotsTable();
    await createTasTable();
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
  }
  catch (err) { console.log(err); };
}

/*
 * Introduces 10 mock slots
 */
async function mockTasScheduleHelper(): Promise<void> {
  const shortcode = "testsc";
  const term = 3;
  const date = new Date("2021-06-17");
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
    }

    try {
      const r = createQ(slotsIds[i].id);
      console.log(r);
      await pool.query(r);
    } catch (err) {
      console.log(err);
    }
  }
}

function mockStatus(i: number): string | null {
  switch (i) {
    case 0: return "CLAIMED";
    case 1: return "READY_TO_CLAIM";
    case 2: return "MISSED";
    case 3: return "ASSIGNED";
    case 4: return "NEXT";
    default: return "ASSIGNED"; // In case we add more than 5 mocked dates
  }
}


export { createAllTables, mockDataForTables };