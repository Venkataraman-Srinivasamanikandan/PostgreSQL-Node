const express = require("express"),
  api = express.Router();

const controller = require("../controller/index");

//Author
api
  .post("/author", controller.author.addAuthor)
  .get("/author/search", controller.author.listAuthor)
  .get("/author/:id", controller.author.findAuthorByID);

//Books
api
  .get("/book", controller.books.listBooks)
  .post("/book", controller.books.addBook)
  .put("/book", controller.books.editBook)
  .delete("/book", controller.books.deleteBook);

module.exports = api;
