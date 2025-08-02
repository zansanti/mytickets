// tests/factories/eventFactory.ts
import { faker } from '@faker-js/faker';
import { prisma } from '../setup';

// Esta função cria um evento no banco
export async function createEvent(params: { 
  name?: string;
  date?: Date;
} = {}) {
  const name = params.name || faker.word.words(3);
  const date = params.date || faker.date.future();
  
  return prisma.event.create({
    data: {
      name,
      date
    }
  });
}

// Esta função gera dados para criar um evento (não cria no banco)
export function generateEventData(params: {
  name?: string;
  date?: Date;
} = {}) {
  return {
    name: params.name || faker.word.words(3),
    date: params.date?.toISOString() || faker.date.future().toISOString()
  };
}