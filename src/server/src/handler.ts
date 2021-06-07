const db = require("../db/postgre");

const invalid = availability => {
  const vals = Object.values(availability);
  return vals.length !== new Set(vals).size
}

function Handler(db) {
  this.db = db;
  this.submitAvailability = async function(username, availability) {
    if (invalid(availability)) {
      return Promise.resolve("You cannot have the same preference for the same day")
    }

    const alreadyHad = await this.db.hasAvailability(username);
    let r = await this.db.setAvailability(username, availability);

    return Promise.resolve(`Availability for ${username} ${alreadyHad ? "overridden" : "set"}`);
  }
  this.getAvailability = async function(username) {
    const row = await db.getUserRow(username);
    return JSON.parse(row.availability);
  }
}

export default Handler
