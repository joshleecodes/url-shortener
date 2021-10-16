"use strict";

const express = require("express");
const cors = require("cors");
const db = require("./services/db");
const linksController = require("./controllers/linksController");

//API Setup
const app = express();
app.use(express.json());
app.use(cors());

//API domain/port definitions
const port = process.env.PORT || 8080;
console.log(`default endpoint: localhost:${port}`);

db.init();

//handle create new link request
app.post("/create-link", (req, res) => {
  linksController.createLinkController(req, res);
});

//handle redirect from shortlink
app.get("/:linkID", async (req, res) => {
  linksController.redirectLinkController(req, res);
});

app.listen(port);
