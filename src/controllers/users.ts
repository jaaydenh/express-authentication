import bcrypt from "bcrypt";
import { RequestHandler } from "express";

import db from "../models";
import { UserLoginEvent } from "../models/userLoginEvent";
import { User } from "../models/users";
import { UserProfile } from "../models/userProfile";
import { authenticate } from "./helpers";

declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

UserProfile.belongsTo(User, { targetKey: 'id' });
User.hasOne(UserProfile, { sourceKey: 'id' });

UserLoginEvent.belongsTo(User, { targetKey: 'id' });
User.hasOne(UserLoginEvent, { sourceKey: 'id' });

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const { password } = req.body;

    const salt = parseInt(process.env.SALT_WORKFACTOR || "", 10);
    const hash = await bcrypt.hash(password, salt);

    const result = await db.transaction(async (t) => {

      const user = await User.create({
        ...req.body, password: hash
      }, { transaction: t });
      user.password = "";

      await user.createUserProfile({
        ...req.body,
      }, { transaction: t });

      return user;
    });

    return res
      .status(200)
      .json({ message: "User created successfully" , result});
  } catch (error) {
    next(error);
  }
};

export const getUserProfile: RequestHandler = async (req, res, next) => {
  try {
    if (req.session.user) {
      const { id } = req.session.user;
      const userProfile = await UserProfile.findOne({
        where: { userId: id }
      });
      return res.status(200).json(userProfile);
    } else {
      return res.status(401).json({ message: "Not Authorized" });
    }
  } catch (error) {
    next(error);
  }
};

export const getUserProfileById: RequestHandler = async (req, res, next) => {
  try {
    if (req.session.user) {
      const { id } = req.params;
      const userProfile = await UserProfile.findOne({ where: { userId: id } });
      if (userProfile) {
        return res.status(200).json(userProfile);
      } else {
        res.status(404).send("Resource not found!")
      }
    }
    return res.status(401).json({ message: "Not Authorized" });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile: RequestHandler = async (req, res, next) => {
  try {
    if (req.session.user) {
      const { id } = req.session.user;
      await UserProfile.update({ ...req.body }, {
        where: { userId: id }
      });
      const userProfile = await UserProfile.findOne({
        where: { userId: id}
      });
      return res.status(200).json(userProfile);
    } else {
      return res.status(401).json({ message: "Not Authorized" });
    }
  } catch (error) {
    next(error);
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await authenticate(req.body);
    if (user) {
      req.session.regenerate(async () => {
        req.session.user = user;
        res.status(200).json({ message: "User login success" });
  
        const ip = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'][0] : req.socket.remoteAddress || '';
        const userAgent = req.headers['user-agent'] || '';
        await user.createUserLoginEvent({
          ip, session: userAgent
        })
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    next(error);
  }
};

export const logoutUser:  RequestHandler = async (req, res) => {
  req.session.destroy(() => {
    console.log('Session destroyed');
  });
  res.redirect('/');
};
