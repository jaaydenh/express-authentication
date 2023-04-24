"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_1 = require("../models/users");
async function authenticate({ email, password }) {
    const user = await users_1.User.scope('withPassword').findOne({ where: { email } });
    if (!user) {
        return false;
    }
    const isValid = await bcrypt_1.default.compare(password, user.password);
    if (!isValid) {
        return false;
    }
    return user;
}
exports.authenticate = authenticate;
