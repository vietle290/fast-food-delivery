import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { serverUrl } from "../../App";
import ChatBoxInput from "./ChatBoxInput";
import MessageList from "./MessageList";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function ChatBox({ conversation, onBack }) {
  const { userData } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  // const [text, setText] = useState("");
  const bottomRef = useRef(null);

  const partner = conversation.participants.find((p) => p._id !== userData._id);
  useEffect(() => {
    // axios
    //   .get(`/api/chat/messages/${conversation._id}`)
    //   .then((res) => setMessages(res.data));
    if (!socket) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/chat/messages/${conversation._id}`,
          { withCredentials: true }
        );
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();

    socket.on("receive-message", (msg) => {
      if (msg.conversationId === conversation._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("receive-message");
  }, [conversation]);

  const sendMessage = ({ text, image }) => {
    const hasText = text && text.trim() !== "";
    const hasImage = !!image;
    if (!hasText && !hasImage) return;

    socket.emit("send-message", {
      conversationId: conversation._id,
      senderId: userData._id,
      receiverId: partner._id,
      text: hasText ? text.trim() : null,
      image: hasImage ? image : null,
    });
    socket.emit("send-update-latest-message", {
      conversationId: conversation._id,
      text: hasText ? text.trim() : "Image",
      senderId: userData._id,
    });
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-3 border-b flex items-center gap-3">
        <button onClick={onBack} className="md:hidden text-gray-600">
          <IoMdArrowRoundBack size={22} />
        </button>
        <span className="font-semibold">{partner.fullName}</span>
      </div>

      <MessageList
        messages={messages}
        userData={userData}
        partner={partner}
        bottomRef={bottomRef}
      />

      <ChatBoxInput sendMessage={sendMessage} />
    </div>
  );
}
