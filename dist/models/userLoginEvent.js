"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLoginEvent = void 0;
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("./index"));
class UserLoginEvent extends sequelize_1.Model {
}
exports.UserLoginEvent = UserLoginEvent;
UserLoginEvent.init({
    ip: {
        type: new sequelize_1.DataTypes.STRING(),
        allowNull: false,
        unique: false,
    },
    session: {
        type: new sequelize_1.DataTypes.STRING(),
        allowNull: false,
        unique: false,
    },
}, {
    tableName: 'user_login_event',
    sequelize: index_1.default,
    defaultScope: {
        attributes: { exclude: ['UserId'] },
    },
});
exports.default = UserLoginEvent;
