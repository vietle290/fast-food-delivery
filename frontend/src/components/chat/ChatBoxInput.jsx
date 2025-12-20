import axios from "axios";
import { useRef, useState } from "react";
import { BsImage, BsSend, BsX } from "react-icons/bs";
import { serverUrl } from "../../App";
import { ClipLoader } from "react-spinners";

export default function ChatBoxInput({ sendMessage }) {
  const [text, setText] = useState("");
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [sending, setSending] = useState(false);
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(
      `${serverUrl}/api/chat/upload-image`,
      formData,
      {
        withCredentials: true,
      }
    );
    return res.data.image;
  };

  const handleSend = async () => {
    if (sending) return;
    if (!text.trim() && !backendImage) return;

    setSending(true);
    try {
      let imageUrl = null;
      if (backendImage) imageUrl = await uploadImage(backendImage);

      sendMessage({ text, image: imageUrl });
      setText("");
      removeImage();
    } finally {
      setSending(false);
    }
  };

  const handleImage = (file) => {
    setBackendImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setPreview(null);
    setBackendImage(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      <div className="p-2 sm:p-3 flex flex-col sm:flex-row gap-2 border-t items-stretch sm:items-center">
        <label
          htmlFor="imageUpload"
          className="cursor-pointer bg-gray-100 p-2 rounded-md 
                 flex justify-center sm:justify-start"
        >
          <BsImage size={20} className="text-gray-600" />
        </label>

        <input
          id="imageUpload"
          type="file"
          ref={fileRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;

            handleImage(file); // upload / preview
            e.target.value = ""; // reset input
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />

        {/* ✏️ Text input */}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          className="flex-1 border px-3 py-2 rounded-md text-sm sm:text-base"
          placeholder="Type a message..."
        />

        {/* 🚀 Send button */}
        <button
          onClick={handleSend}
          disabled={sending}
          className="bg-[#F59E0B] text-white px-3 py-2 rounded-md hover:bg-[#FBBF24] transition justify-center flex items-center"
        >
          {sending ? (
            <ClipLoader color="#fff" size={15} />
          ) : (
            <BsSend size={20} />
          )}
        </button>
      </div>
      
        {preview && (
          <div className="p-3">
            <div className="relative inline-block">
              <img
                src={preview}
                alt="preview"
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md border"
              />

              {/* ❌ Delete preview */}
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
              >
                <BsX size={14} />
              </button>
            </div>
          </div>
        )}
      
    </div>
  );
}
