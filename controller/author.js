const common = require("../helper/common");

const validator = require("node-validator"),
  async_handler = require("express-async-handler");

const db = require("../db/index");

module.exports = {
  listAuthor: async_handler(async (req, res) => {
    var search = req.query.search ? req.query.search : "";
    const { rows } = await db.query(
      `SELECT * 
			FROM authors
			WHERE name ILIKE '${search}%'
			ORDER BY name
			LIMIT 5;`
    );
    return res.json({
      status: 200,
      message: "Authors found successfully",
      data: rows,
    });
  }),
  findAuthorByID: async_handler(async (req, res) => {
    var id = req.params.id;
    const { rows } = await db.query(
      `SELECT * 
			FROM authors
			WHERE id = ${id};`
    );
    if (rows.length <= 0) {
      res.status(400);
      return res.json({
        message: "Author not found",
      });
    }
    return res.json({
      status: 200,
      message: "Author found successfully",
      data: rows[0],
    });
  }),
  addAuthor: async_handler(async (req, res) => {
    let requestData = req.body;
    let check = validator
      .isObject()
      .withRequired("name", validator.isString({ regex: /^(?=.*[\w\d]).+/ }));
    await common.validate(check, requestData, res);
    await db.query("INSERT INTO authors (name) VALUES ($1)", [
      requestData.name,
    ]);
    return res.json({ message: "Author inserted successfully" });
  }),
};
