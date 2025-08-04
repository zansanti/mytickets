// tests/factories/eventFactory.ts
import { faker } from '@faker-js/faker';
import { prisma } from '../setup';

// Função para criar um evento diretamente no banco
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

// Função para gerar dados para criação de evento
export function generateEventData(params: {
  name?: string;
  date?: Date;
} = {}) {
  return {
    name: params.name || faker.word.words(3),
    date: params.date?.toISOString() || faker.date.future().toISOString()
  };
}

// Classe com método estático para compatibilidade com testes de tickets
export class EventFactory {
  static create() {
    return {
      name: faker.word.words(3),
      date: faker.date.future().toISOString()
    };
  }
}