// integration test
const postgre = require("./db/postgre");
const Handler = require("./src/handler");

const handler = new Handler(postgre);

console.log("---- [SERVER INTEGRATION TESTS] ----");

test("After adding availability into postrgesql, we can retreive it", async () => {
  const name = `andrei::${new Date().toString()}`;
  const avail = {Mon: "1", Thu: "2", Fri: "3"};
  await handler.submitAvailability(name, JSON.stringify(avail));
  const availability = await handler.getAvailability(name);
  expect(availability).toEqual(avail);
})