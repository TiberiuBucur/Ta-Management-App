// integration test
import { postgre } from "./db/postgre";
import Handler from "./handler";

const handler = new Handler(postgre);

console.log("---- [SERVER INTEGRATION TESTS] ----");

test("After adding availability into postrgesql, we can retreive it", async () => {
    const name = `andrei::${new Date().getSeconds()}`;
    let avail = {Mon: "1", Thu: "2", Fri: "3"};
    await handler.submitAvailability(name, avail);
    const availability = await handler.getAvailability(name);
    expect(availability).toEqual(avail);
})
