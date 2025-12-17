import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../App";
import { useSelector } from "react-redux";

export default function ChatList({ onSelect, selectedConversation }) {
  const { userData } = useSelector((state) => state.user);
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
  }, [userData._id]);

  
  return (
    <div className="w-1/3 border-r bg-white">
      {conversations.map((c) => {
        const partner = c.participants.find(
          (p) => p._id !== userData._id
        );

        const avatarLetter = partner?.fullName
          ?.charAt(0)
          .toUpperCase();

        const isActive = selectedConversation?._id === c._id;

        return (
          <div
            key={c._id}
            onClick={() => onSelect(c)}
            className={`flex items-center p-3 cursor-pointer transition
              ${
                isActive
                  ? "bg-blue-50"
                  : "hover:bg-gray-100"
              }
            `}
          >
            {/* Avatar + online */}
            <div className="relative mr-3 flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-semibold">
                {avatarLetter}
              </div>

              {partner?.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>

            {/* Content */}
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
  );

}
