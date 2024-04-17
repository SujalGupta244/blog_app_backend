import express from "express";
import {getAllUsers, signup, login, verifyToken, getUser, refresh} from '../controller/user-controller.js';


const router = express.Router();


router.get("/",getAllUsers);
router.post("/signup",signup);
router.post("/login",login);
router.get('/verify',verifyToken,getUser);
router.get('/refresh',refresh)

export default router;

