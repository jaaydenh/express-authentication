import { Router } from 'express';

import {
  createUser,
  getUserProfileById,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile
} from "../controllers/users";

const router = Router();

router.post('/register', createUser);

router.post('/login', loginUser)

router.get('/user', getUserProfile);

router.get('/user/:id/profile', getUserProfileById);

router.patch('/user', updateUserProfile);

router.get('/logout', logoutUser);

router.get('/', (req, res) => {
    res.status(200).send('Success!');
})

export default router;