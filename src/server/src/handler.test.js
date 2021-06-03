const Handler = require("./handler");

function MockDb(isSet=true) {
  this.cnt1 = 0;
  this.cnt2 = 0;
  this.hasAvailability = async function() {
    this.cnt1++;
    return Promise.resolve(isSet);
  }
  this.setAvailability = async function() {
    this.cnt2++;
    return Promise.resolve(isSet);
  }
}

test("Submitting availability when not already set sets it", async () => {
  const mockDb = new MockDb(false);
  const handler = new Handler(mockDb);
  const msg = await handler.submitAvailability("random.user", {"Mon": "1", "Thu": "2", "Fri": "3"})
  expect(mockDb.cnt1).toBe(1);
  expect(mockDb.cnt2).toBe(1);
  expect(msg.includes("set")).toBe(true)
})

test("Submitting availability when already set overrides it", async () => {
  const mockDb = new MockDb();
  const handler = new Handler(mockDb);
  const msg = await handler.submitAvailability("random.user", {"Mon": "1", "Thu": "2", "Fri": "3"})
  expect(mockDb.cnt1).toBe(1);
  expect(mockDb.cnt2).toBe(1);
  expect(msg.includes("overridden")).toBe(true)
})

test("Availabilities won't be submitted if invalid", async () => {
  const mockDb = new MockDb();
  const handler = new Handler(mockDb);
  const msg = await handler.submitAvailability("random.user", {"Mon": "3", "Thu": "2", "Fri": "3"})
  expect(mockDb.cnt1).toBe(0);
  expect(mockDb.cnt2).toBe(0);
  expect(msg.includes("cannot have")).toBe(true)
})