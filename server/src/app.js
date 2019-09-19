const express = require("express");
const cors = require("cors");

class App {
  constructor() {
    this.server = express();
    this.midleware();
  }
  midleware() {
    this.server.use(cors());
    this.server.use(express.json());
  }
}
module.exports = new App().server;
