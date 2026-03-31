import express from "express";
import  { proj,dproj,sd } from "../controller/projct.controller.js";
import {v,g, dt,dp,gc,dltk} from "../controller/task.controller.js";
const router=express.Router();

router.post("/createproject",proj);
router.get("/displayproject",dproj);
router.post("/createtask/:id",v);
router.get("/gettask/:id",g);
router.get("/displaytask",dt);
router.delete("/deleteproj/:id",dp);
router.get("/getcount",gc);
router.delete("/deletetask/:id",dltk);
router.get("/search-data",sd);

export default router;