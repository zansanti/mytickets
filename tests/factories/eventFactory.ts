import { faker } from "@faker-js/faker";

export class EventFactory {
  static create() {
    return {
      name: faker.lorem.words(3),
      date: faker.date.future(), // Evento no futuro
    };
  }
}