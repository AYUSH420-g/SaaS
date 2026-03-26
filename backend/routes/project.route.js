import express from "express";
import  { proj,dproj } from "../controller/projct.controller.js";
import {v,g, dt,dp} from "../controller/task.controller.js";
const router=express.Router();

router.post("/projects",proj);
router.get("/displayproject",dproj);
router.post("/task",v);
router.get("/gettask/:id",g);
router.get("/displaytask",dt);
router.delete("/deleteproj/:id",dp);

export default router;