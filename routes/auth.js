import express from "express";
import { login, register } from "../controllers/auth.js";
import cookieParser from 'cookie-parser';

const router = express.Router();

router.use(cookieParser());

router.post("/register", register)
router.post("/login", login)

export default router