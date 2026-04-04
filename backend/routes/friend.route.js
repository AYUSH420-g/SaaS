import express from "express";
import {
    sendRequest,
    getRequests,
    acceptRequest,
    rejectRequest,
    getFriends,
} from "../controller/friend.controller.js";

const router = express.Router();

router.post("/send", sendRequest);
router.get("/requests", getRequests);
router.put("/accept/:requestId", acceptRequest);
router.put("/reject/:requestId", rejectRequest);
router.get("/friends", getFriends);

export default router;
