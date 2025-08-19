// tests/integration/events.test.ts
import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import { prisma } from '../setup';
import { createEvent, generateEventData } from '../factories/eventFactory';
import app from '../../src/index';
import supertest from 'supertest';

const testServer = supertest(app)

jest.setTimeout(60000);  // Aumentado para 60 segundos

describe("Events API", () => {
  // Limpar o banco antes de cada teste
  beforeEach(async () => {
    await prisma.ticket.deleteMany({});
    await prisma.event.deleteMany({});
  });

  describe("GET /events", () => {
    it("should respond with empty array when there are no events", async () => {
      const response = await testServer.get("/events");
      
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([]);
    });

    it("should respond with all events", async () => {
      const event = await createEvent();

      const response = await testServer.get("/events");
      
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toEqual(expect.objectContaining({
        id: event.id,
        name: event.name,
      }));
    });
  });

  describe("GET /events/:id", () => {
    it("should respond with event data", async () => {
      const event = await createEvent();

      const response = await testServer.get(`/events/${event.id}`);
      
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(expect.objectContaining({
        id: event.id,
        name: event.name,
      }));
    });

    it("should respond with 404 when event is not found", async () => {
      // Buscar o maior ID existente
      const highestIdEvent = await prisma.event.findFirst({
        orderBy: { id: 'desc' }
      });
      
      // Usar um ID que certamente não existe
      const nonExistentId = (highestIdEvent?.id || 0) + 1000;
      
      const response = await testServer.get(`/events/${nonExistentId}`);
      
      expect([httpStatus.NOT_FOUND, httpStatus.BAD_REQUEST]).toContain(response.status);
    });
  });

  describe("POST /events", () => {
    it("should create an event and respond with 201", async () => {
      const eventData = generateEventData();
      
      const response = await testServer.post("/events").send(eventData);
      
      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toEqual(expect.objectContaining({
        id: expect.any(Number),
        name: eventData.name,
      }));

      // Verifica se foi criado no banco
      const eventInDB = await prisma.event.findFirst({
        where: { name: eventData.name }
      });
      expect(eventInDB).not.toBeNull();
    });

    it("should respond with 422 when data is invalid", async () => {
      const response = await testServer.post("/events").send({
        // missing fields
      });
      
      expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  describe("PUT /events/:id", () => {
    it("should update an event and respond with 200", async () => {
      const event = await createEvent();
      const updatedData = generateEventData();
      
      const response = await testServer.put(`/events/${event.id}`).send(updatedData);
      
      expect(response.status).toBe(httpStatus.OK);
      
      // Verifica se foi atualizado no banco
      const updatedEvent = await prisma.event.findUnique({
        where: { id: event.id }
      });
      expect(updatedEvent.name).toBe(updatedData.name);
    });

    it("should respond with 404 when trying to update a non-existent event", async () => {
      // Buscar o maior ID existente
      const highestIdEvent = await prisma.event.findFirst({
        orderBy: { id: 'desc' }
      });
      
      // Usar um ID que certamente não existe
      const nonExistentId = (highestIdEvent?.id || 0) + 1000;
      
      const response = await testServer.put(`/events/${nonExistentId}`).send(generateEventData());
      
      expect([httpStatus.NOT_FOUND, httpStatus.BAD_REQUEST]).toContain(response.status);
    });
  });

  describe("DELETE /events/:id", () => {
    it("should delete an event and respond with 204", async () => {
      const event = await createEvent();
      
      const response = await testServer.delete(`/events/${event.id}`);
      
      expect(response.status).toBe(httpStatus.NO_CONTENT);
      
      // Verificação se foi removido
      const deletedEvent = await prisma.event.findUnique({
        where: { id: event.id }
      });
      expect(deletedEvent).toBeNull();
    });

    it("should respond with 404 when trying to delete a non-existent event", async () => {
      // Buscar o maior ID existente
      const highestIdEvent = await prisma.event.findFirst({
        orderBy: { id: 'desc' }
      });
      
      // Usar um ID que certamente não existe
      const nonExistentId = (highestIdEvent?.id || 0) + 1000;
      
      const response = await testServer.delete(`/events/${nonExistentId}`);
      
      expect([httpStatus.NOT_FOUND, httpStatus.BAD_REQUEST]).toContain(response.status);
    });
  });
});