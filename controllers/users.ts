import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import db from "../models";

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

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, name, displayName } = req.body;

    const salt = parseInt(process.env.SALT_WORKFACTOR || "", 10);
    const hash = await bcrypt.hash(password, salt);
  
    // var user = await User.create({ ...req.body, password: hash });

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
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getUserProfile: RequestHandler = async (req, res, next) => {
  if (req.session.user) {
    const { id } = req.session.user;
    const userProfile = await UserProfile.findOne({
      where: { userId: id }
    });
    return res.status(200).json(userProfile);
  } else {
    return res.status(401).json({ message: "Not Authorized" });
  }
};

export const getUserProfileById: RequestHandler = async (req, res, next) => {
  if (req.session.user) {
    const { id } = req.params;
    const userProfile = await UserProfile.findOne({ where: { userId: id } });
    return res.status(200).json(userProfile);
  } else {
    return res.status(401).json({ message: "Not Authorized" });
  }
};

export const updateUserProfile: RequestHandler = async (req, res, next) => {
  if (req.session.user) {
    const { id } = req.session.user;
    await UserProfile.update({ ...req.body }, {
      where: { userId: id }
    });
    const user = await User.scope('withPassword').findByPk(id);
    return res.status(200).json(user);
  } else {
    return res.status(401).json({ message: "Not Authorized" });
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  if (email && password) {
    const user = await authenticate(req.body);
      if (user) {
        req.session.regenerate(function(){
          req.session.user = user;
          res.status(200).json({ message: "User login success" });
          // res.redirect('user');
        });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
        // res.redirect('/login');
      }
    
  } else {
    const err = new Error('Email and password are required.');
    return next(err);
  }
};

export const logoutUser:  RequestHandler = async (req, res, next) => {
  req.session.destroy(() => {
    console.log('Session destroyed');
  });
  res.redirect('/');
};