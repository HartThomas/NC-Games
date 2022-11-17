const request = require("supertest");
const app = require("../app");
const db = require("../db");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));

afterAll(() => {
  if (db.end) db.end();
});

describe("GET /api/categories", () => {
  test("status - 200, an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toBeInstanceOf(Array);
        body.categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/reviews", () => {
  test("status - 200, an array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toBeInstanceOf(Array);
        body.reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              designer: expect.any(String),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
  test("status -200, the reviews are sorted in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("ERROR / typo or unknown path", () => {
  test("status - 404, error with message route not found", () => {
    return request(app)
      .get("/api/skdjhfks")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("status - 200, returns one review object", () => {
    return request(app)
      .get("/api/reviews/4")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual(
          expect.objectContaining({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: 4,
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            review_body: expect.any(String),
          })
        );
      });
  });
  test("status - 400, invalid id", () => {
    return request(app)
      .get("/api/reviews/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input type");
      });
  });
  test("status - 404, no review with that ID", () => {
    return request(app)
      .get("/api/reviews/9001")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Review not found");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("status - 200, an array of comments for the given review id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              comment_id: expect.any(Number),
              review_id: 2,
              created_at: expect.any(String),
              votes: expect.any(Number),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("status -200, the reviews are sorted as the most recent first", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at");
      });
  });
  test("status - 404, if given an invalid id", () => {
    return request(app)
      .get("/api/reviews/9001/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Review not found");
      });
  });
  test("status - 400, invalid id", () => {
    return request(app)
      .get("/api/reviews/notAnId/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input type");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  const newComment = {
    username: "dav3rid",
    body: "Farmyard fun doesnt even scratch the surface. I have spent many hours toiling over decisions in this game. Such as should I eat my cow now or try and nab an extra cow next turn and get them to breed, but what if Tash wants cows next turn?! She will be going first after all. Hmm maybe I should just take the starting player token off her, she has had it for about 1 turn which is far too long if you ask me.",
  };
  test("status - 201, posts comment and sends it back", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({ ...newComment });
      });
  });
  test("status - 400, missing required fields", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required field/s");
      });
  });
  test("status - 400, failing schema validation", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({ username: "notAUsername", body: "I concur" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Failing schema validation");
      });
  });
  test("status - 404, if given an invalid id", () => {
    return request(app)
      .post("/api/reviews/9001/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Review not found");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  const voteChange = { inc_votes: 9001 };
  test("returns the updated review", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send(voteChange)
      .expect(201)
      .then(({ body }) => {
        expect(body.review).toEqual(
          expect.objectContaining({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: 1,
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: 9002,
            designer: expect.any(String),
            review_body: expect.any(String),
          })
        );
      });
  });
  test("status - 400, missing required fields", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required field/s");
      });
  });
  test("status - 400, failing schema validation", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: "notAVote" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input type");
      });
  });
  test("status - 404, review not found", () => {
    return request(app)
      .patch("/api/reviews/9001")
      .send(voteChange)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Review not found");
      });
  });
  test("status - 400, invalid id", () => {
    return request(app)
      .patch("/api/reviews/notAnId")
      .send(voteChange)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid id");
      });
  });
});

describe.only("GET /api/users", () => {
  test("status 200, returns array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});
