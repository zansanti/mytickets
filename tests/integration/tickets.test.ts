import { testServer } from "../setup";
import { EventFactory } from "../factories/eventFactory";
import { TicketFactory } from "../factories/ticketFactory";
import { faker } from '@faker-js/faker';
import { prisma } from "../setup";

describe("Tickets Routes", () => {
  let eventId: number;

  beforeAll(async () => {
    // Cria um evento VÁLIDO (no futuro) para associar aos tickets
    const eventResponse = await testServer.post("/events").send(EventFactory.create());
    eventId = eventResponse.body.id;
  });

  afterAll(async () => {
    // Limpa o banco após todos os testes
    await prisma.ticket.deleteMany();
    await prisma.event.deleteMany();
  });

  // ---- TESTES DE CRIAÇÃO DE TICKET ---- //
  it("should create a ticket for a valid event", async () => {
    const ticketData = TicketFactory.create(eventId);
    const response = await testServer.post("/tickets").send(ticketData);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.code).toBe(ticketData.code);
  });

  it("should reject tickets for past events", async () => {
    const pastEvent = {
      name: "Past Event",
      date: faker.date.past(), // Data no passado
    };
    const eventResponse = await testServer.post("/events").send(pastEvent);
    const pastEventId = eventResponse.body.id;

    const ticketData = TicketFactory.create(pastEventId);
    const response = await testServer.post("/tickets").send(ticketData);
    
    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/already happened/);
  });

  it("should reject duplicate ticket codes for the same event", async () => {
    const ticketData = TicketFactory.create(eventId);
    await testServer.post("/tickets").send(ticketData); // Primeiro ticket (sucesso)
    const response = await testServer.post("/tickets").send(ticketData); // Segundo ticket (deve falhar)
    
    expect(response.status).toBe(409);
    expect(response.body.message).toMatch(/already registered/);
  });

  // ---- TESTES DE USO DO TICKET ---- //
  it("should mark a ticket as used", async () => {
    const ticketData = TicketFactory.create(eventId);
    const createResponse = await testServer.post("/tickets").send(ticketData);
    const ticketId = createResponse.body.id;

    const useResponse = await testServer.put(`/tickets/use/${ticketId}`);
    
    expect(useResponse.status).toBe(200);
    expect(useResponse.body.used).toBe(true);
  });

  it("should reject using an already used ticket", async () => {
    const ticketData = TicketFactory.create(eventId);
    const createResponse = await testServer.post("/tickets").send(ticketData);
    const ticketId = createResponse.body.id;

    // Primeira marcação (sucesso)
    await testServer.put(`/tickets/use/${ticketId}`);
    // Segunda tentativa (deve falhar)
    const response = await testServer.put(`/tickets/use/${ticketId}`);
    
    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/already used/);
  });

  it("should reject using a non-existent ticket", async () => {
    const fakeTicketId = 999999; // ID que não existe
    const response = await testServer.put(`/tickets/use/${fakeTicketId}`);
    
    expect(response.status).toBe(404);
    expect(response.body.message).toMatch(/not found/);
  });

  // ---- TESTES DE LISTAGEM ---- //
  it("should list all tickets for an event", async () => {
    // Cria 2 tickets para o evento
    await testServer.post("/tickets").send(TicketFactory.create(eventId));
    await testServer.post("/tickets").send(TicketFactory.create(eventId));

    const response = await testServer.get(`/tickets/${eventId}`);
    
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it("should return empty list for event with no tickets", async () => {
    const newEvent = await testServer.post("/events").send(EventFactory.create());
    const response = await testServer.get(`/tickets/${newEvent.body.id}`);
    
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);
  });
});