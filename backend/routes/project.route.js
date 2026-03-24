import express from "express";
import  { proj,dproj } from "../controller/projct.controller.js";
import {v,g} from "../controller/task.controller.js";
const router=express.Router();

router.post("/projects",proj);
router.get("/displayproject",dproj);
router.post("/task",v);
router.get("/gettask/:id",g);

export default router;