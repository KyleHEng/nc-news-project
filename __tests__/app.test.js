const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  // this function will reseed the test data before each test
  return seed(testData);
});

afterAll(() => {
  //this closes the connection to the database
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("/api/topics", () => {
  test("GET 200: Responds with an object detailing all the topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("/notAnEndpoint", () => {
  test("404: Responds with an object informing that the endpoint was not found", () => {
    return request(app)
      .get("/notAnEndpoint")
      .expect(404)
      .then((response) => {
        expect(response.body.error).toBe("Endpoint not found");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET: 200 responds with an article object with correct properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article).toEqual(
          expect.objectContaining({
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            article_id: expect.any(Number),
          })
        );
      });
  });
});
