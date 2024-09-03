const express = require("express");
const controller = require("../controller/controller-collection");
const userAuth = require("../middleware/userAuth");

const server = express.Router();

// TODO: change /get to 'GET', change body input to header input
server.post("/get", userAuth, controller.messageController.getMessage_post);

server.get("/send", userAuth, controller.messageController.sendMessage_get);
server.post("/send", userAuth, controller.messageController.sendMessage_post);

module.exports = server;
