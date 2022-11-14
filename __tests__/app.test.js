const request = require("supertest");
const app = require("../app");
const db = require("../db");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");


beforeEach(() => seed(testData));

afterAll(() => {
  if (db.end) db.end();
});

describe('GET /api/categories', () => {
    test('status - 200, an array of category objects', () => {
        return request(app)
            .get('/api/categories')
            .expect(200)
            .then((body) => {
                expect(body.categories).toBeInstanceOf(Array);
                body.categories.forEach((category) => {
                    expect(category).toEqual(
                        expect.objectContaining({
                            slug: expect.any(String),
                            description: expect.any(String),
                        }))
                })
                
        })
    })
})