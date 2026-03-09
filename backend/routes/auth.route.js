import express from "express";
const router=express.Router();
import {sgnup,lgin} from '../components/auth.component.js';

router.post("/signup",sgnup);
router.post("/login",lgin);

export default router;