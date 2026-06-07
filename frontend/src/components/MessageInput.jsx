import React, { useState } from 'react'
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";


function MessageInput() {
    const { playRamdomKeyStrokeSound } = useKeyboardSound();
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = React.useRef(null);
    const { sendMessage, isSoundEnabled } = useChatStore();

    const handleSendMessage = (e) => {
      // prevent the page refresh when submitting the form
      e.preventDefault();
      
      if (!text.trim() && !imagePreview) {
        return; // don't send empty messages
      }
      // play sound if enabled after clicking the send button
      if (isSoundEnabled) {
        playRamdomKeyStrokeSound();
      }
      sendMessage({ text: text.trim(), image: imagePreview });
      // preset the input field and the image preview
      setText("");  
      setImagePreview(null);
      if(fileInputRef.current) {
        fileInputRef.current.value = ""; // reset the file input
      }
    }
 

    const handleImageChange = (e) => {
      const file = e.target.files[0];

      if (!file?.type.startsWith("image/")) {
        toast.error("Only image files are allowed");
        return;
      }
      if (file) {
        const reader = new FileReader(); 
        reader.onloadend = () => setImagePreview(reader.result);
        // base 64 string of the image file, it can be sent to the backend store in the database
        // this is used to display the image preview before sending the message
        reader.readAsDataURL(file);
      }
    };

    const removeImage = () => {
      setImagePreview(null);
      if(fileInputRef.current) {
        fileInputRef.current.value = ""; // reset the file input
      }
    };
    // what we want here implemen here:
    // 1. input field for text message
    // 2. button to send message
    // 3. button to attach image
  return (
    <>
    <div className="p-4 border-t bg-slate-700/50">
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
        {/* Image Preview */}
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-slate-700"
            />
            <button
              onClick={removeImage}
              className="absolute-top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
       <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex space-x-4">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            isSoundEnabled && playRamdomKeyStrokeSound();
          }}
          className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          placeholder="Type your message..."
        />
        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors ${
            imagePreview ? "text-cyan-500" : ""
          }`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <button
          type="submit"
          disabled={!text?.trim() && !imagePreview}
          className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>    
    </>
    
  )
}

export default MessageInput