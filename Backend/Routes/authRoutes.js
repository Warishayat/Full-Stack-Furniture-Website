const {RegisterUser, LoginUser} = require("../Controller/Users/authController");
const express = require('express');
const authRouter = express.Router();

authRouter.post('/register', RegisterUser);
authRouter.post('/login', LoginUser);

module.exports = authRouter;
