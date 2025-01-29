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
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            article_id: 1,
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
  test("PATCH: 200 responds with an updated article object with the correct properties", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -100 })
      .expect(200)
      .then((response) => {
        expect(response.body.article).toEqual({
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          article_id: 1,
        });
      });
  });
  test("PATCH: 400 responds with error message when given malformed request data", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "seven" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toEqual("Bad request");
      });
  });
  test("PATCH: 404 responds with error message when article id not found", () => {
    return request(app)
      .patch("/api/articles/193")
      .send({ inc_votes: 73 })
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
  test("POST: 201 responds with a comment object of the posted comment", () => {
    return request(app)
      .post("/api/articles/9/comments")
      .send({ username: "icellusedkars", body: "This is a test comment" })
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toEqual({
          body: "This is a test comment",
          votes: 0,
          author: "icellusedkars",
          article_id: 9,
          created_at: expect.any(String),
          comment_id: expect.any(Number),
        });
      });
  });
  test("POST: 400 responds with error message when given malformed comment", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ name: "icellusedkars", body: "Still a test comment" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toEqual("Bad request");
      });
  });
  test("POST: 404 responds with error message when id not found", () => {
    return request(app)
      .post("/api/articles/353/comments")
      .send({ username: "icellusedkars", body: "This is a test comment" })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual("Article ID not found");
      });
  });
  test("POST: 404 responds with error message when username not found", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "userA", body: "This is a test comment" })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual("Required request details not found");
      });
  });
});
