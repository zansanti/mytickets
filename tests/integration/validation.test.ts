// tests/integration/validation.test.ts
// import { testServer } from "../setup";
import httpStatus from 'http-status';
import app from '../../src/index';
import supertest from 'supertest';

const testServer = supertest(app)

describe("Parameter Validation", () => {
  // Teste para eventos
  describe("Events ID validation", () => {
    it("should respond with 400 when event ID is invalid in GET route", async () => {
      const response = await testServer.get("/events/abc");
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with 400 when event ID is invalid in PUT route", async () => {
      const response = await testServer.put("/events/abc").send({
        name: "Test Event",
        date: new Date().toISOString()
      });
      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it("should respond with 400 when event ID is invalid in DELETE route", async () => {
      const response = await testServer.delete("/events/abc");
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
  });

  // Teste para tickets
  describe("Tickets ID validation", () => {
    it("should respond with 400 when ticket ID is invalid in PUT route", async () => {
      const response = await testServer.put("/tickets/use/abc");
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with 400 when event ID is invalid in GET tickets route", async () => {
      const response = await testServer.get("/tickets/abc");
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
  });
});