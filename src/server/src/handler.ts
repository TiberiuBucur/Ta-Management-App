import { RecurringSlot, Slot } from './Slot';

const invalid = availability => {
  const vals = Object.values(availability);
  return vals.length !== new Set(vals).size
}

function Handler(db) {
  this.db = db;

  this.submitAvailability = async function (username, availability) {
    if (invalid(availability)) {
      return Promise.resolve("You cannot have the same preference for the same day");
    }

    const alreadyHad = await this.db.hasAvailability(username);
    await this.db.setAvailability(username, availability);

    return Promise.resolve(`Availability for ${username} ${alreadyHad ? "overridden" : "set"}`);
  }

  this.getAvailability = async function (username) {
    const row = await db.getUserRow(username);
    return JSON.parse(row.availability);
  }

  this.submitSessions = async function (slots: Slot[], recurrings: RecurringSlot[]): Promise<void> {
    await this.db.setSessions(slots);
    await this.db.setRecurring(recurrings);
  }
}

export default Handler
