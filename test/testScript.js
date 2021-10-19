const faker = require("faker");
const db = require("../db/index");

module.exports = {
  getAuthorId: async () => {
    return new Promise(async (resolve) => {
      const { rows } = await db.query(
        `SELECT * 
          FROM authors
          LIMIT 1;`
      );
      if (rows.length > 0) {
        return resolve(rows[0].id);
      } else {
        return resolve(await insertAuthor());
      }
    });
  },
  getBookId: async (auhtorId) => {
    return new Promise(async (resolve) => {
      const { rows } = await db.query(
        `SELECT * 
          FROM books
          ORDER BY id DESC
          LIMIT 1;`
      );
      if (rows.length > 0) {
        return resolve(rows[0].id);
      } else {
        return resolve(await insertBook(auhtorId));
      }
    });
  },
};

function insertAuthor() {
  return new Promise(async (resolve) => {
    var { rows } = await db.query(
      `INSERT INTO authors (name) VALUES (${faker.name.findName()}) RETURNING *`
    );
    resolve(rows[0].id);
  });
}
function insertBook(auhtorId) {
  return new Promise(async (resolve) => {
    var { rows } = await db.query(
      `INSERT INTO authors (name, "authorId") VALUES (${faker.name.findName()},${auhtorId}) RETURNING *`
    );
    resolve(rows[0].id);
  });
}
