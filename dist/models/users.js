"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("./index"));
// interface UserAttributes {
//   id: string;
//   email: string;
//   password: string;
// }
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: new sequelize_1.DataTypes.STRING(),
        allowNull: false,
        unique: true,
    },
    password: {
        type: new sequelize_1.DataTypes.STRING(),
        allowNull: false,
        unique: false,
    },
}, {
    tableName: 'users',
    sequelize: index_1.default,
    defaultScope: {
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    },
    scopes: {
        withPassword: {
            attributes: undefined,
        }
    }
});
exports.default = User;
