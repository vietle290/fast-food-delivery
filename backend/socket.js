import User from "./models/user.model.js";
import Message from "./models/message.model.js";
import Conversation from "./models/conversation.model.js";

export const socketHandler = async (io) => {
  io.on("connection", (socket) => {
    socket.on("identity", async ({ userId }) => {
      try {
        const user = await User.findByIdAndUpdate(
          userId,
          {
            socketId: socket.id,
            isOnline: true,
          },
          { new: true }
        );
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("update-location", async ({ latitude, longitude, userId }) => {
      try {
        const user = await User.findByIdAndUpdate(userId, {
          location: { type: "Point", coordinates: [longitude, latitude] },
          isOnline: true,
          socketId: socket.id,
        });

        if (user) {
          io.emit("update-shipper-location", {
            shipperId: userId,
            latitude,
            longitude,
          });
        }
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("send-message", async (data) => {
      const { conversationId, senderId, receiverId, text } = data;

      const message = await Message.create({
        conversationId,
        sender: senderId,
        receiver: receiverId,
        text,
      });

      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: text,
        lastSender: senderId,
      });

      const receiver = await User.findById(receiverId);

      if (receiver?.socketId) {
        io.to(receiver.socketId).emit("receive-message", message);
      }

      socket.emit("receive-message", message);
    });

    socket.on("send-update-latest-message", async ({ conversationId, text, senderId }) => {
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: text,
        lastSender: senderId,
      });
      const conversation = await Conversation.findById(conversationId);
      conversation.participants.forEach(async (participantId) => {
        if (participantId.toString() !== senderId) {
          const participant = await User.findById(participantId);
          if (participant?.socketId) {
            io.to(participant.socketId).emit("receive-update-latest-message", {
              conversationId,
              text,
              senderId,
            });
          }
        }
      });
    });

    socket.on("disconnect", async () => {
      try {
        const user = await User.findOneAndUpdate(
          { socketId: socket.id },
          {
            socketId: null,
            isOnline: false,
          },
          { new: true }
        );
      } catch (error) {
        console.log(error);
      }
    });
  });
};
