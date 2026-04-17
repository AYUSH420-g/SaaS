import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.route.js";
import projectRoutes from "./routes/project.route.js";
import friendRoutes from "./routes/friend.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/",projectRoutes);
app.use("/auth", authRoutes);
app.use("/friend", friendRoutes);



mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});