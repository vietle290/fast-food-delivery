import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const getOrCreateConversation = async (req, res) => {
  const { buyerId, ownerId } = req.body;

  if (!ownerId) return res.status(400).json({ message: "ownerId required" });

  let conversation = await Conversation.findOne({
    participants: { $all: [buyerId, ownerId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [buyerId, ownerId],
    });
  }

  res.json(conversation);
};

export const getMyConversations = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  const conversations = await Conversation.find({
    participants: userId,
  })
    .populate("participants", "fullName role isOnline")
    .sort({ updatedAt: -1 });

  res.json(conversations);
};

export const getMessages = async (req, res) => {
  const { conversationId } = req.params;

  const messages = await Message.find({ conversationId })
    .populate("sender", "fullName role")
    .populate("receiver", "fullName role")
    .sort({ createdAt: 1 });

  res.json(messages);
};
