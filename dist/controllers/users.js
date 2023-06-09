"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.loginUser = exports.updateUserProfile = exports.getUserProfileById = exports.getUserProfile = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const models_1 = __importDefault(require("../models"));
const userLoginEvent_1 = require("../models/userLoginEvent");
const users_1 = require("../models/users");
const userProfile_1 = require("../models/userProfile");
const helpers_1 = require("./helpers");
userProfile_1.UserProfile.belongsTo(users_1.User, { targetKey: 'id' });
users_1.User.hasOne(userProfile_1.UserProfile, { sourceKey: 'id' });
userLoginEvent_1.UserLoginEvent.belongsTo(users_1.User, { targetKey: 'id' });
users_1.User.hasOne(userLoginEvent_1.UserLoginEvent, { sourceKey: 'id' });
const createUser = async (req, res, next) => {
    try {
        const { password } = req.body;
        const salt = parseInt(process.env.SALT_WORKFACTOR || "", 10);
        const hash = await bcrypt_1.default.hash(password, salt);
        const result = await models_1.default.transaction(async (t) => {
            const user = await users_1.User.create(Object.assign(Object.assign({}, req.body), { password: hash }), { transaction: t });
            user.password = "";
            await user.createUserProfile(Object.assign({}, req.body), { transaction: t });
            return user;
        });
        return res
            .status(200)
            .json({ message: "User created successfully", result });
    }
    catch (error) {
        next(error);
    }
};
exports.createUser = createUser;
const getUserProfile = async (req, res, next) => {
    try {
        if (req.session.user) {
            const { id } = req.session.user;
            const userProfile = await userProfile_1.UserProfile.findOne({
                where: { userId: id }
            });
            return res.status(200).json(userProfile);
        }
        else {
            return res.status(401).json({ message: "Not Authorized" });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getUserProfile = getUserProfile;
const getUserProfileById = async (req, res, next) => {
    try {
        if (req.session.user) {
            const { id } = req.params;
            const userProfile = await userProfile_1.UserProfile.findOne({ where: { userId: id } });
            if (userProfile) {
                return res.status(200).json(userProfile);
            }
            else {
                res.status(404).send("Resource not found!");
            }
        }
        return res.status(401).json({ message: "Not Authorized" });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserProfileById = getUserProfileById;
const updateUserProfile = async (req, res, next) => {
    try {
        if (req.session.user) {
            const { id } = req.session.user;
            await userProfile_1.UserProfile.update(Object.assign({}, req.body), {
                where: { userId: id }
            });
            const userProfile = await userProfile_1.UserProfile.findOne({
                where: { userId: id }
            });
            return res.status(200).json(userProfile);
        }
        else {
            return res.status(401).json({ message: "Not Authorized" });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.updateUserProfile = updateUserProfile;
const loginUser = async (req, res, next) => {
    try {
        const user = await (0, helpers_1.authenticate)(req.body);
        if (user) {
            req.session.regenerate(async () => {
                req.session.user = user;
                res.status(200).json({ message: "User login success" });
                const ip = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'][0] : req.socket.remoteAddress || '';
                const userAgent = req.headers['user-agent'] || '';
                await user.createUserLoginEvent({
                    ip, session: userAgent
                });
            });
        }
        else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.loginUser = loginUser;
const logoutUser = async (req, res) => {
    req.session.destroy(() => {
        console.log('Session destroyed');
    });
    res.redirect('/');
};
exports.logoutUser = logoutUser;
