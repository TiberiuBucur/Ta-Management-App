import { RecurringSlot, Slot } from './Slot';
import { postgre, Postgre } from './db/postgre';
import { mockTasAvailabilities } from './db/initsAndMocks';

const invalid = availability => {
  const vals = Object.values(availability);
  return vals.length !== new Set(vals).size
}

class Handler {
  private db: Postgre;
  constructor(db: Postgre) { this.db = db; }

  public async submitAvailability(username, availability): Promise<any> {
    if (invalid(availability)) {
      return Promise.resolve("You cannot have the same preference for the same day");
    }

    const alreadyHad = await this.db.hasAvailability(username);
    await this.db.setAvailability(username, availability);

    return Promise.resolve(`Availability for ${username} ${alreadyHad ? "overridden" : "set"}`);
  }

  public async getAvailability(username): Promise<any> {
    const row = await this.db.getUserRow(username);
    return JSON.parse(row.availability);
  }

  public async submitSessions(slots: Slot[], recurrings: RecurringSlot[]): Promise<void> {
    console.log("submit sess");
    await this.db.setSessions(slots);
    await this.db.setRecurring(recurrings);
    await mockTasAvailabilities();
  }
}

export default Handler
