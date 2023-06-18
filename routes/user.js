const express = require('express')
const controller = require('../controller/controller-collection')
const userAuth = require('../middleware/userAuth')

const server = express.Router()

server.get('/signup', controller.usersController.signup_get)
server.post('/signup', controller.usersController.signup_post)

server.get('/login', controller.usersController.login_get)
server.post('/login', controller.usersController.login_post)

server.post('/logout', userAuth, controller.usersController.logout_get)

server.get('/getusers', userAuth, controller.usersController.getUsersExcept_get)

module.exports = server