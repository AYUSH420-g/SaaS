import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.route.js";
import projectRoutes from "./routes/project.route.js";
import friendRoutes from "./routes/friend.route.js";
import Message from "./models/message.model.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: "*"
}));
app.use(express.json());

app.use("/",projectRoutes);
app.use("/auth", authRoutes);
app.use("/friend", friendRoutes);

// ── Chat History Endpoint ──
app.get("/messages/:projectId", async (req, res) => {
    try {
        const { projectId } = req.params;
        const limit = parseInt(req.query.limit) || 50;
        const before = req.query.before; // cursor-based pagination

        const query = { projectId };
        if (before) {
            query.createdAt = { $lt: new Date(before) };
        }

        const messages = await Message.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        // Return in chronological order
        res.status(200).json(messages.reverse());
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

// ── Socket.IO ──
io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    // Join a project chat room
    socket.on("join-room", (projectId) => {
        socket.join(projectId);
        console.log(`Socket ${socket.id} joined room ${projectId}`);
    });

    // Leave a project chat room
    socket.on("leave-room", (projectId) => {
        socket.leave(projectId);
        console.log(`Socket ${socket.id} left room ${projectId}`);
    });

    // Send a message
    socket.on("send-message", async (data) => {
        try {
            const { projectId, senderId, senderName, text } = data;

            // Save to database
            const message = new Message({
                projectId,
                senderId,
                senderName,
                text
            });
            await message.save();

            // Broadcast to all clients in the room (including sender)
            io.to(projectId).emit("receive-message", {
                _id: message._id,
                projectId,
                senderId,
                senderName,
                text,
                createdAt: message.createdAt
            });
        } catch (err) {
            console.error("Error saving message:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log("🔌 Socket disconnected:", socket.id);
    });
});

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const PORT = process.env.PORT || 3003;

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Socket.IO ready`);
});