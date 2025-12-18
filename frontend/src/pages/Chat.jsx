import { useState } from "react";
import ChatList from "../components/chat/ChatList";
import ChatBox from "../components/chat/ChatBox";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const navigate = useNavigate();

  const handleNavigateBack = () => {
    navigate(-1);
  }


  return (
    <div className="flex h-screen">
      <ChatList onSelect={setSelectedConversation} selectedConversation={selectedConversation} handleNavigateBack={handleNavigateBack}/>

      {selectedConversation ? (
        <ChatBox
          conversation={selectedConversation}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Choose a conversation to start or continue chatting
        </div>
      )}
    </div>
  );
}
