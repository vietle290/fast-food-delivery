import React from "react";
import { useSelector } from "react-redux";

const MessageList = React.memo(function MessageList({
  messages,
  userData,
  partner,
  bottomRef,
}) {
  const { myOrders } = useSelector((state) => state.user);

  return (
    <div className="flex-1 overflow-y-auto p-3">
      {messages.map((m) => {
        const senderId =
          typeof m.sender === "object" ? m.sender._id : m.sender;

        const isMe = senderId === userData._id;

        const avatarLetter = isMe
          ? userData.fullName?.charAt(0).toUpperCase()
          : partner.fullName?.charAt(0).toUpperCase();

        const hasText = typeof m.text === "string" && m.text.trim() !== "";
        const hasImage = typeof m.image === "string" && m.image.trim() !== "";

        return (
          <div
            key={m._id}
            className={`mb-3 flex ${
              isMe ? "justify-end" : "justify-start"
            }`}
          >
            {!isMe && (
              <div className="w-8 h-8 mr-2 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-semibold">
                {avatarLetter}
              </div>
            )}

            {/* 💬 Message content */}
            <div className="max-w-[70%] flex flex-col gap-1">
              {/* 🖼 Image */}
              {hasImage && (
                <img
                  src={m.image}
                  alt="message"
                  className="max-w-[240px] rounded-lg border object-cover"
                />
              )}

              {/* ✏️ Text bubble (CHỈ khi có text) */}
              {hasText && (
                <div
                  className={`px-3 py-2 rounded-lg whitespace-pre-wrap break-words ${
                    isMe
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {m.text}
                </div>
              )}
            </div>

            {isMe && (
              <div className="w-8 h-8 ml-2 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                {avatarLetter}
              </div>
            )}
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
});

export default MessageList;
