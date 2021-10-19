const common = require("../helper/common");

const validator = require("node-validator"),
  async_handler = require("express-async-handler");

const db = require("../db/index");

module.exports = {
  listBooks: async_handler(async (req, res) => {
    let requestData = req.query;
    requestData.size = +requestData.size ? +requestData.size : 5;
    requestData.pageNo = +requestData.pageNo ? +requestData.pageNo : 1;
    let check = validator
      .isObject()
      .withOptional("search", validator.isString())
      .withOptional("size", validator.isInteger({ min: 1 }))
      .withOptional("pageNo", validator.isInteger({ min: 1 }));
    await common.validate(check, requestData, res);
    var limit = requestData.size,
      skip = (requestData.pageNo - 1) * limit,
      search = requestData.search ? requestData.search : "";
    const { rows } = await db.query(
      `SELECT b.name as book_name, b.id as book_id, a.name as author_name, a.id as authorId, count(*) OVER() AS full_count
			FROM books b
			LEFT JOIN authors a
				ON b."authorId" = a.id
			WHERE b.name ILIKE '${search}%'
			ORDER BY b.name
			LIMIT $1 OFFSET $2`,
      [limit, skip]
    );
    var total = rows[0] ? rows[0].full_count : 0,
      resData = rows.map(({ full_count, ...item }) => item);
    return res.json({
      status: true,
      message: "Books found successfully",
      data: resData,
      pages: Math.ceil(total / limit),
    });
  }),
  addBook: async_handler(async (req, res) => {
    let requestData = req.body;
    let check = validator
      .isObject()
      .withRequired("name", validator.isString({ regex: /^(?=.*[\w\d]).+/ }))
      .withRequired("authorId", validator.isInteger({ min: 1 }));
    await common.validate(check, requestData, res);
    await db.query(`INSERT INTO books (name, "authorId") VALUES ($1, $2)`, [
      requestData.name,
      requestData.authorId,
    ]);
    return res.json({ status: true, message: "Book inserted successfully" });
  }),
  editBook: async_handler(async (req, res) => {
    let requestData = req.body;
    let check = validator
      .isObject()
      .withRequired("id", validator.isInteger({ min: 1 }))
      .withRequired("name", validator.isString({ regex: /^(?=.*[\w\d]).+/ }))
      .withRequired("authorId", validator.isInteger({ min: 1 }));
    await common.validate(check, requestData, res);
    await db.query(
      `UPDATE books 
			 SET name = $1,
			 "authorId" = $2
			 WHERE id = $3`,
      [requestData.name, requestData.authorId, requestData.id]
    );
    return res.json({ status: true, message: "Book updated successfully" });
  }),
  deleteBook: async_handler(async (req, res) => {
    let requestData = req.body;
    let check = validator
      .isObject()
      .withRequired("id", validator.isInteger({ min: 1 }));
    await common.validate(check, requestData, res);
    await db.query(
      `DELETE FROM books
			 WHERE id = $1`,
      [requestData.id]
    );
    return res.json({ status: true, message: "Book deleted successfully" });
  }),
};
