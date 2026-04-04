import Request from "../models/req.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

// Send a friend request
const sendRequest = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

       
        if (!senderId || !receiverId) {
             console.log(senderId);
            console.log(receiverId);
            return res.status(400).json({ message: "senderId and receiverId are required" });
        }

        const senderObjectId = new mongoose.Types.ObjectId(senderId);

        const receiver = await User.findById( receiverId );
        if (!receiver) {
            return res.status(404).json({ message: "User not found" });
        }

        if (receiver._id.toString() === senderId) {
            return res.status(400).json({ message: "Cannot send request to yourself" });
        }

        const existing = await Request.findOne({
            $or: [
                { senderId: senderObjectId, receiverId: receiver._id },
                { senderId: receiver._id, receiverId: senderObjectId }
            ]
        });

        if (existing) {
            return res.status(400).json({ message: "Friend request already exists" });
        }

        const request = new Request({
            senderId: senderObjectId,
            receiverId: receiver._id,
        });

        await request.save();
        res.status(201).json({ message: "Friend request sent", request });
    } catch (err) {
        console.log("Send friend request error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Get pending friend requests for a user (received)
const getRequests = async (req, res) => {
    try {
        const { userId } = req.query;

        const requests = await Request.find({
            receiverId: userId,
            status: "pending",
        }).populate("senderId", "name email");

        res.status(200).json(requests);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Accept a friend request
const acceptRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        const request = await Request.findByIdAndUpdate(
            requestId,
            { status: "accepted" },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        res.status(200).json({ message: "Request accepted", request });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Reject a friend request
const rejectRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        const request = await Request.findByIdAndUpdate(
            requestId,
            { status: "rejected" },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        res.status(200).json({ message: "Request rejected", request });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Get accepted friends list
const getFriends = async (req, res) => {
    try {
        const { userId } = req.query;

        const friends = await Request.find({
            $or: [
                { senderId: userId, status: "accepted" },
                { receiverId: userId, status: "accepted" }
            ]
        })
            .populate("senderId", "name email")
            .populate("receiverId", "name email");

        res.status(200).json(friends);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

export { sendRequest, getRequests, acceptRequest, rejectRequest, getFriends };
