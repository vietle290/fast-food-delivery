import { useState } from "react";
import { BsSend } from "react-icons/bs";


export default function ChatBoxInput({ sendMessage }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    sendMessage(text);
    setText("");
  };

  return (
    <div className="p-3 flex gap-2 border-t">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
        className="flex-1 border px-2 rounded-md py-2"
      />
      <button onClick={handleSend} className="bg-[#F59E0B] text-white px-2 py-2 rounded-md hover:bg-[#FBBF24] transition"><BsSend /></button>
    </div>
  );
}
