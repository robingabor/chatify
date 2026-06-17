import React from 'react'
import { useChatStore } from '../store/useChatStore';
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import ChatHeader from './ChatHeader';
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton';
import MessageInput from './MessageInput';

function ChatContainer() {
    const { 
      isMessagesLoading,
      getMessagesByUserId,
      selectedUser,
      messages, 
      subscribeToNewMessages,
      unsubscribeFromNewMessages
    } = useChatStore();
    const { authUser } = useAuthStore();
    const messageEndRef = React.useRef(null);

    useEffect(()=> {
      // fetch the messages
      getMessagesByUserId(selectedUser._id);
      // subscribe to new messages when the component mounts
      subscribeToNewMessages();
      // cleanup
      // unsubscribe from new messages when the component unmounts
      return () => {
        unsubscribeFromNewMessages();
      }
    }, [selectedUser, getMessagesByUserId, subscribeToNewMessages, unsubscribeFromNewMessages]);
    
    useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              >
                <div
                  className={`chat-bubble relative ${
                    msg.senderId === authUser._id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <img src={msg.image} alt="Shared" className="rounded-lg h-48 object-cover" />
                  )}
                  {msg.text && <p className="mt-2">{msg.text}</p>}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {/* scroll target */}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer