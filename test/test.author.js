const server = require("../server"),
  testScript = require("./testScript");

const chai = require("chai"),
  chaiHttp = require("chai-http"),
  faker = require("faker");

chai.use(chaiHttp);
chai.should();

const commonValues = {
  name: faker.name.findName(),
};

describe("ADD AUTHOR", () => {
  it("Should not send success response if user is inserting new author with invalid parameters", (done) => {
    var request = {
      authorName: commonValues.name,
      age: 10,
    };
    chai
      .request(server)
      .post("/api/v1/author")
      .send(request)
      .end((err, res) => {
        res.status.should.be.equal(400);
        res.body.message.should.be.equal("Invalid parameters");
        done();
      });
  });
  it("Should send success response if user is inserting new author", (done) => {
    var request = {
      name: commonValues.name,
    };
    chai
      .request(server)
      .post("/api/v1/author")
      .send(request)
      .end((err, res) => {
        res.status.should.be.equal(200);
        res.body.message.should.be.equal("Author inserted successfully");
        done();
      });
  });
  it("Should not send success response if author already exists", (done) => {
    var request = {
      name: commonValues.name,
    };
    chai
      .request(server)
      .post("/api/v1/author")
      .send(request)
      .end((err, res) => {
        res.status.should.be.equal(500);
        done();
      });
  });
  it("Should not send success response if author already exists(case sensitive)", (done) => {
    var request = {
      name: commonValues.name.toUpperCase(),
    };
    chai
      .request(server)
      .post("/api/v1/author")
      .send(request)
      .end((err, res) => {
        res.status.should.be.equal(500);
        done();
      });
  });
});
describe("LIST AUTHOR", () => {
  it("Should send top 5 alphabetical ordered authors", (done) => {
    chai
      .request(server)
      .get("/api/v1/author/search")
      .end((err, res) => {
        res.status.should.be.equal(200);
        res.body.message.should.be.equal("Authors found successfully");
        done();
      });
  });
  it("Should send top 5 alphabetical ordered authors with search", (done) => {
    chai
      .request(server)
      .get("/api/v1/author/search?search=test")
      .end((err, res) => {
        res.status.should.be.equal(200);
        res.body.message.should.be.equal("Authors found successfully");
        done();
      });
  });
});
describe("FIND AUTHOR BY ID", () => {
  var authorId = 0;
  before(async () => {
    authorId = await testScript.getAuthorId();
  });
  it("Should send author detail by Id", (done) => {
    chai
      .request(server)
      .get("/api/v1/author/" + authorId)
      .end((err, res) => {
        res.status.should.be.equal(200);
        res.body.message.should.be.equal("Author found successfully");
        done();
      });
  });
  it("hould not send author detail if id doesn't exists on DB", (done) => {
    chai
      .request(server)
      .get("/api/v1/author/-1")
      .end((err, res) => {
        res.status.should.be.equal(400);
        res.body.message.should.be.equal("Author not found");
        done();
      });
  });
});
describe("404 RESPONSE", () => {
  it("Should send 404 response", (done) => {
    chai
      .request(server)
      .post("/api/v1/author/search")
      .end((err, res) => {
        res.status.should.be.equal(404);
        done();
      });
  });
});
