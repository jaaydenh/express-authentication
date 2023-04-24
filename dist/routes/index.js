"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../controllers/users");
const router = (0, express_1.Router)();
router.post('/register', users_1.createUser);
router.post('/login', users_1.loginUser);
router.get('/user', users_1.getUserProfile);
router.get('/user/:id/profile', users_1.getUserProfileById);
router.patch('/user', users_1.updateUserProfile);
router.get('/logout', users_1.logoutUser);
router.get('/', (req, res) => {
    res.status(200).send('Success!');
});
exports.default = router;
