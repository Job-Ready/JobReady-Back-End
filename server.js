// server.js
const http = require("http");
const app = require("./app");
const path = require("path");
require("dotenv").config({
  override: true,
  path: path.resolve(__dirname, ".env"),
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "localhost";

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});
