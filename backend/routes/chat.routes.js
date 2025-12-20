import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  getMessages,
  getMyConversations,
  getOrCreateConversation,
} from "../controllers/chat.controllers.js";
import { upload } from "../middlewares/multer.js";
import uploadCloudinary from "../utils/cloudinary.js";
import fs from "fs";

const chatRouter = express.Router();

chatRouter.post("/conversation", isAuth, getOrCreateConversation);
chatRouter.post("/conversations", isAuth, getMyConversations);
chatRouter.get("/messages/:conversationId", isAuth, getMessages);
chatRouter.post(
  "/upload-image",
  isAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      let image = null;

      if (req.file) {
        image = await uploadCloudinary(req.file.path);
      }

      return res.status(200).json({ image });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

export default chatRouter;
