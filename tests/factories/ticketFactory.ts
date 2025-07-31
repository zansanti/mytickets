import { faker } from "@faker-js/faker";

export class TicketFactory {
  static create(eventId: number) {
    return {
      owner: faker.person.fullName(),
      code: faker.string.alphanumeric(10),
      eventId,
    };
  }
}