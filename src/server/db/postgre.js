const { Pool } = require("pg");

const prodMode = true;

const db = prodMode
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

// TODO
function Postgre(pool) {
  this.pool = pool;
  this.setAvailability = async function () {
    return Promise.resolve(true);
  };
  this.hasAvailability = Promise.resolve(true);
}

module.exports = new Postgre(db);
