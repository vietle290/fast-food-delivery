import React from "react";

const MessageList = React.memo(function MessageList({
  messages,
  userData,
  partner,
  bottomRef,
}) {
  return (
    <div className="flex-1 overflow-y-auto p-3">
      {messages.map((m) => {
        const senderId =
          typeof m.sender === "object" ? m.sender._id : m.sender;

        const isMe = senderId === userData._id;

        const avatarLetter = isMe
          ? userData.fullName?.charAt(0).toUpperCase()
          : partner.fullName?.charAt(0).toUpperCase();

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

            <div
              className={`px-3 py-2 rounded-lg max-w-[70%] whitespace-pre-wrap break-words ${
                isMe
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {m.text}
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
