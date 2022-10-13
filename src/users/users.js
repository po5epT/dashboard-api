"use strict";
exports.__esModule = true;
exports.userRouter = void 0;
var express_1 = require("express");
var userRouter = express_1["default"].Router();
exports.userRouter = userRouter;
userRouter.post('/login', function (req, res) {
    res.send('login');
});
userRouter.post('/register', function (req, res) {
    res.send('register');
});
