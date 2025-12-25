import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../App";
import { useSelector } from "react-redux";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function ChatList({ onSelect, selectedConversation, handleNavigateBack }) {
  const { userData } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.post(
          `${serverUrl}/api/chat/conversations`,
          { userId: userData._id },
          { withCredentials: true }
        );

        setConversations(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchConversations();

      if (!socket) return;

      socket.on("receive-update-latest-message", (msg) => {
        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv._id === msg.conversationId
              ? { ...conv, lastMessage: msg.text, lastSender: msg.senderId }
              : conv
          )
        );
      });

      return () => socket.off("receive-update-latest-message");
    
  }, [userData._id, socket]);

  return (
    <div className="h-full flex flex-col bg-white border-r">
      {/* Header */}
      <div className="p-4 border-b font-semibold text-lg">
        Messages
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((c) => {
          const partner = c.participants.find(
            (p) => p._id !== userData._id
          );
          const isActive = selectedConversation?._id === c._id;

          return (
            <div
              key={c._id}
              onClick={() => onSelect(c)}
              className={`flex items-center p-3 cursor-pointer transition
                ${isActive ? "bg-blue-50" : "hover:bg-gray-100"}
              `}
            >
              <div className="relative mr-3">
                <div className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center">
                  {partner?.fullName?.charAt(0).toUpperCase()}
                </div>
                {partner?.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>

              <div className="flex-1 overflow-hidden">
                <div className="font-semibold truncate">
                  {partner?.fullName}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {c.lastMessage || "No messages yet"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t">
        <button
          onClick={handleNavigateBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <IoMdArrowRoundBack size={20} />
          Back
        </button>
      </div>
    </div>
  );
}
