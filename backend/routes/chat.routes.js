import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { getMessages, getMyConversations, getOrCreateConversation } from "../controllers/chat.controllers.js";

const chatRouter = express.Router();

chatRouter.post("/conversation", isAuth, getOrCreateConversation);
chatRouter.post("/conversations", isAuth, getMyConversations);
chatRouter.get("/messages/:conversationId", isAuth, getMessages);

export default chatRouter;