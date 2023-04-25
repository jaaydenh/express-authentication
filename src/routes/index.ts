import { Router } from 'express';

import {
  createUser,
  getUserProfileById,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile
} from "../controllers/users";
import validateResource from "../middleware/validateResource";
import { createUserSchema } from '../schema/createUserSchema';
import { loginSchema } from '../schema/loginSchema';
import { updateUserSchema } from '../schema/updateUserSchema';

const router = Router();

router.post('/register', validateResource(createUserSchema) , createUser);

router.post('/login', validateResource(loginSchema), loginUser)

router.get('/user', getUserProfile);

router.get('/user/:id/profile', getUserProfileById);

router.patch('/user', validateResource(updateUserSchema), updateUserProfile);

router.post('/logout', logoutUser);

router.get('/', (req, res) => {
    res.status(200).send('Success!');
});

export default router;