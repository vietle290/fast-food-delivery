import { useState } from "react";
import ChatList from "../components/chat/ChatList";
import ChatBox from "../components/chat/ChatBox";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const navigate = useNavigate();

  const handleNavigateBack = () => {
    if (selectedConversation) {
      setSelectedConversation(null); // mobile: back to sidebar
    } else {
      navigate(-1); // desktop or root back
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`
          w-full md:w-1/3 lg:w-1/4
          ${selectedConversation ? "hidden md:block" : "block"}
        `}
      >
        <ChatList
          onSelect={setSelectedConversation}
          selectedConversation={selectedConversation}
          handleNavigateBack={handleNavigateBack}
        />
      </div>
      <div
        className={`
          flex-1
          ${selectedConversation ? "block" : "hidden md:block"}
        `}
      >
        {selectedConversation ? (
          <ChatBox
            conversation={selectedConversation}
            onBack={handleNavigateBack}
          />
        ) : (
          <div className="hidden md:flex h-full items-center justify-center text-gray-500">
            Choose a conversation to start or continue chatting
          </div>
        )}
      </div>
    </div>
  );
}
