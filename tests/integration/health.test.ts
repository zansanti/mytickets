import app from '../../src/index';
import supertest from 'supertest';

const testServer = supertest(app)

describe("GET /health", () => {
  it("should return 200 and 'I'm okay!'", async () => {
    const response = await testServer.get("/health");
    
    // Verifica o status code e o texto da resposta
    expect(response.status).toBe(200);
    expect(response.text).toBe("I'm okay!");
  });
});