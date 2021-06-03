const db = require("../db/postgre");

const invalid = availability => {
  const vals = Object.values(availability);
  return vals.length !== new Set(vals).size
}

function Handler(db) {
  this.db = db;
  this.submitAvailability = async function(usrname, availability) {
    if (invalid(availability)) {
      return Promise.resolve("You cannot have the same preference for the same day")
    }

    const alreadyHad = await this.db.hasAvailability(usrname)
    await this.db.setAvailability(usrname, availability);

    return Promise.resolve(`Availability for ${usrname} ${alreadyHad ? "overridden" : "set"}`);
  }
}

module.exports = Handler;