"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authController_1 = require("../controllers/authController");
var router = (0, express_1.Router)();
router.post('/login', authController_1.loginUser);
router.get('/verify', authController_1.checkToken);
exports.default = router;
