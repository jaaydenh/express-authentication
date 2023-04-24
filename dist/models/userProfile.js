"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfile = void 0;
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("./index"));
class UserProfile extends sequelize_1.Model {
}
exports.UserProfile = UserProfile;
UserProfile.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: new sequelize_1.DataTypes.STRING(),
        allowNull: false,
        unique: false,
    },
    displayName: {
        type: new sequelize_1.DataTypes.STRING(),
        allowNull: false,
        unique: false,
    },
}, {
    tableName: 'user_profiles',
    sequelize: index_1.default,
    defaultScope: {
        attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'UserId'] },
    },
});
exports.default = UserProfile;
