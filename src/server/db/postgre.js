const { Pool } = require("pg");
const tableName = "tas";

function Postgre(pool) {
  this.pool = pool;
  this.setAvailability = async (username, availability) => {
    const isSet = await this.hasAvailability(username);
    const stringAvail = JSON.stringify(availability);
    return isSet ? pool.query("UPDATE tas SET availability = $1 WHERE username = $2", [stringAvail, username])
     : pool.query("INSERT INTO tas (username, availability) VALUES($1, $2)", [username, stringAvail]);
  };
  this.hasAvailability = async (username) => {
    const qresult = await pool.query("SELECT * FROM tas where username = $1", [username]);
    return qresult.rows.length === 0;
  };
  this.getUserRow = async (username) => {
    const qresult = await pool.query("SELECT * FROM tas WHERE username = $1", [username]);
    return qresult.rows[0];
  };
}

const prodMode = process.env.DATABASE_URL !== undefined;
console.log(`PRODUCTION MODE: ${prodMode}`);
const pool = prodMode
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

module.exports = new Postgre(pool);
