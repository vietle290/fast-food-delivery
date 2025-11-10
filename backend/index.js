import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRouter from "./routes/auth.routes.js";
import connectDb from "./config/db.js";
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";
import orderRouter from "./routes/order.routes.js";
import categoryRouter from "./routes/category.routes.js";
import http from "http";
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";

const app = express();
const server = http.createServer(app); 


const io = new Server(server, {
    cors: {
        origin: "https://fast-food-delivery-y483.onrender.com",
        methods: ["GET", "POST"],
        credentials: true
    },
});

app.set("io", io);


const port = process.env.PORT || 5000;


mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
});

//middlewares
app.use(cors({
    origin: "https://fast-food-delivery-y483.onrender.com",
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);
app.use("/api/category", categoryRouter);

socketHandler(io);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

server.listen(port, () => {
    connectDb();
    console.log("Connected to backend on port " + port);
});