import { useState } from "react";

export default function ChatBoxInput({ sendMessage }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    sendMessage(text);
    setText("");
  };

  return (
    <div className="p-3 flex">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
        className="flex-1 border px-2"
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
