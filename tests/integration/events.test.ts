import { testServer } from "../setup";
import { EventFactory } from "../factories/eventFactory";

describe("Events Routes", () => {
  it("should create an event", async () => {
    const eventData = EventFactory.create();
    const response = await testServer.post("/events").send(eventData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should reject duplicate event names", async () => {
    const eventData = EventFactory.create();
    await testServer.post("/events").send(eventData);
    const response = await testServer.post("/events").send(eventData);
    expect(response.status).toBe(409); // Conflict
  });

  it("should get all events", async () => {
    await testServer.post("/events").send(EventFactory.create());
    const response = await testServer.get("/events");
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});