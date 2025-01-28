const endpointsJson = require("../endpoints.json");

const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");

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
  test("GET: 400 responds with error message for malformed parameters", () => {
    return request(app)
      .get("/api/articles/NotANumber")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toEqual("Bad request");
      });
  });
  test("GET: 404 responds with error message when article id not found", () => {
    return request(app)
      .get("/api/articles/500")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual("Article ID not found");
      });
  });
});

describe("/api/articles", () => {
  test("GET: 200 responds with an articles array of article objects with correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        response.body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              article_id: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET: 200 responds with an array of comments for the given article id, sorted by most recent comment, with the correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        response.body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            })
          );
        });
        expect(response.body.comments).toBeSortedBy("created_at");
      });
  });
  test("GET: 400 responds with an error message when given a malformed article id", () => {
    return request(app)
      .get("/api/articles/abcdefg/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toEqual("Bad request");
      });
  });
  test("GET: 404 responds with error message when article id not found", () => {
    return request(app)
      .get("/api/articles/567/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual("Article ID not found");
      });
  });
  test("GET: 200 responds with an empty array when given an article id with no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body.comments)).toEqual(true);
        expect(response.body.comments.length).toEqual(0);
      });
  });
});
