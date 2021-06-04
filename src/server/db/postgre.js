const { Pool } = require("pg");

function Postgre(pool) {
  this.pool = pool;
  this.setAvailability = (username, availability) => 
    pool.query("UPDATE user SET availability = $1 WHERE username = $2", [JSON.stringify(availability), username])
  this.hasAvailability = () => Promise.resolve(false)
  this.getUserRow = async (username) => {
    const qresult = pool.query("SELECT * FROM user WHERE username = $1", [username]);
    return qresult.rows[0];
  }
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
      user: 'postgres',
      host: 'localhost',
      database: 'testdb',
      password: 'fghijbon8976',
      port: 5432
    });


module.exports = new Postgre(pool);
