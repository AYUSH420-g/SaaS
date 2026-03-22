import express from "express";
import  { proj,dproj } from "../controller/projct.controller.js";
import v from "../controller/task.controller.js";
const router=express.Router();

router.post("/projects",proj);
router.get("/displayproject",dproj);
router.post("/task",v);

export default router;