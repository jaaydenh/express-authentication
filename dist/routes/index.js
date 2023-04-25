"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../controllers/users");
const validateResource_1 = __importDefault(require("../middleware/validateResource"));
const createUserSchema_1 = require("../schema/createUserSchema");
const loginSchema_1 = require("../schema/loginSchema");
const updateUserSchema_1 = require("../schema/updateUserSchema");
const router = (0, express_1.Router)();
router.post('/register', (0, validateResource_1.default)(createUserSchema_1.createUserSchema), users_1.createUser);
router.post('/login', (0, validateResource_1.default)(loginSchema_1.loginSchema), users_1.loginUser);
router.get('/user', users_1.getUserProfile);
router.get('/user/:id/profile', users_1.getUserProfileById);
router.patch('/user', (0, validateResource_1.default)(updateUserSchema_1.updateUserSchema), users_1.updateUserProfile);
router.post('/logout', users_1.logoutUser);
router.get('/', (req, res) => {
    res.status(200).send('Success!');
});
exports.default = router;
