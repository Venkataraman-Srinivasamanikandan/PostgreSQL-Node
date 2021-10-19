const server = require("../server"),
  testScript = require("./testScript");

const chai = require("chai"),
  chaiHttp = require("chai-http"),
  faker = require("faker");

chai.use(chaiHttp);
chai.should();

describe("ADD BOOK", () => {
  var authorId = 0;
  before(async () => {
    authorId = await testScript.getAuthorId();
  });
  it("Should not send success response if user is inserting new book with invalid parameters", (done) => {
    var request = {
      bookName: faker.name.title(),
      age: 10,
    };
    chai
      .request(server)
      .post("/api/v1/book")
      .send(request)
      .end((err, res) => {
        res.status.should.be.equal(400);
        res.body.message.should.be.equal("Invalid parameters");
        done();
      });
  });
  it("Should send success response if user is inserting new book", (done) => {
    var request = {
      name: faker.name.title(),
      authorId,
    };
    chai
      .request(server)
      .post("/api/v1/book")
      .send(request)
      .end((err, res) => {
        res.status.should.be.equal(200);
        res.body.message.should.be.equal("Book inserted successfully");
        done();
      });
  });
});
describe("LIST BOOKS", () => {
  it("Should send top 5 alphabetical ordered books", (done) => {
    chai
      .request(server)
      .get("/api/v1/book")
      .end((err, res) => {
        res.status.should.be.equal(200);
        res.body.message.should.be.equal("Books found successfully");
        done();
      });
  });
  it("Should send books according to the pagination", (done) => {
    chai
      .request(server)
      .get("/api/v1/book?pageNo=1&size=5&search=one")
      .end((err, res) => {
        res.status.should.be.equal(200);
        res.body.message.should.be.equal("Books found successfully");
        done();
      });
  });
});
describe("EDIT BOOK", () => {
  var authorId = 0,
    bookId = 0;
  before(async () => {
    authorId = await testScript.getAuthorId();
    bookId = await testScript.getBookId(authorId);
  });
  it("Should not send success response if user is inserting new book with invalid parameters", (done) => {
    var request = {
      bookName: faker.name.title(),
      age: 10,
    };
    chai
      .request(server)
      .put("/api/v1/book")
      .send(request)
      .end((err, res) => {
        res.status.should.be.equal(400);
        res.body.message.should.be.equal("Invalid parameters");
        done();
      });
  });
  it("Should send success response if user is editing book with valid parameters", (done) => {
    var request = {
      name: faker.name.title(),
      id: bookId,
      authorId,
    };
    chai
      .request(server)
      .put("/api/v1/book")
      .send(request)
      .end((err, res) => {
        res.status.should.be.equal(200);
        res.body.message.should.be.equal("Book updated successfully");
        done();
      });
  });
  it("Should not send success response if user is editing book with invalid authorId", (done) => {
    var request = {
      name: faker.name.title(),
      id: bookId,
      authorId: 100,
    };
    chai
      .request(server)
      .put("/api/v1/book")
      .send(request)
      .end((err, res) => {
        res.status.should.be.equal(500);
        done();
      });
  });
});
describe("DELETE BOOK", () => {
  var bookId = 0;
  before(async () => {
    bookId = await testScript.getBookId(await testScript.getAuthorId());
  });
  it("Should not send success response if user is delete book with invalid parameters", (done) => {
    var request = {
      bookName: faker.name.title(),
      age: 10,
    };
    chai
      .request(server)
      .delete("/api/v1/book")
      .send(request)
      .end((err, res) => {
        res.status.should.be.equal(400);
        res.body.message.should.be.equal("Invalid parameters");
        done();
      });
  });
  it("Should send success response if user is deleting book with valid parameters", (done) => {
    var request = {
      id: bookId,
    };
    chai
      .request(server)
      .delete("/api/v1/book")
      .send(request)
      .end((err, res) => {
        res.status.should.be.equal(200);
        res.body.message.should.be.equal("Book deleted successfully");
        done();
      });
  });
});

describe("SAMPLE API", () => {
  it("Should send 200", (done) => {
    chai
      .request(server)
      .get("/")
      .end((err, res) => {
        res.status.should.be.equal(200);
        done();
      });
  });
});
