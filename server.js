require("dotenv").config();

const config = require("./config");
const { notFound, errorHandler } = require("./middleware/error");

const express = require("express"),
  logger = require("morgan"),
  cors = require("cors"),
  http = require("http");

const app = express();

// Engine setup
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const routes = require("./routes/index");

app.get("/", (req, res) => {
  return res.json({ msg: "Hello" });
});
app.use("/api/v1", routes);
app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);

server.listen(config.port, () =>
  console.log(`Express server running on port ` + config.port)
);

module.exports = server;
