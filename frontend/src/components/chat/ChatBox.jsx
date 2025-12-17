import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { serverUrl } from "../../App";
import ChatBoxInput from "./ChatBoxInput";
import MessageList from "./MessageList";

export default function ChatBox({ conversation }) {
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


const sendMessage = (text) => {
  if (!text.trim()) return;

  socket.emit("send-message", {
    conversationId: conversation._id,
    senderId: userData._id,
    receiverId: partner._id,
    text,
  });
};


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-2/3 flex flex-col">
      <div className="p-3 border-b">{partner.fullName}</div>

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
