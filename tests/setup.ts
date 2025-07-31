// tests/setup.ts
import express from 'express';
import supertest from 'supertest';
import { PrismaClient } from '@prisma/client';
import ticketsRouter from '../src/routers/tickets-router'; // Importe seus routers
import eventsRouter from '../src/routers/events-router';
import errorHandlerMiddleware from '../src/middlewares/error-middleware';
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

const testApp = express();
testApp.get("/health", (req, res) => res.status(200).send("I'm okay!")); 
testApp.use(express.json());
testApp.use(ticketsRouter);
testApp.use(eventsRouter);
testApp.use(errorHandlerMiddleware);

export const testServer = supertest(testApp);
export const prisma = new PrismaClient();

// Limpeza do banco
beforeEach(async () => {
  await prisma.ticket.deleteMany();
  await prisma.event.deleteMany();
});