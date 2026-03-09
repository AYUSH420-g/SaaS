import express from "express";
import  { proj,dproj } from "../components/projct.components.js";
const router=express.Router();

router.post("/projects",proj);
router.get("/displayproject",dproj)

export default router;