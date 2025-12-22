import express from "express";

const healthRouter = express.Router();

healthRouter.get("/wake-up-server", (req, res) => {
    return res.status(200).json({ message: "OK" });
});

export default healthRouter;