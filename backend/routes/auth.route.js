import express from "express";
const router=express.Router();
import {sgnup,lgin} from '../controller/auth.controller.js';

router.post("/signup",sgnup);
router.post("/login",lgin);

export default router;