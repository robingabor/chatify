import React from 'react'
import { useChatStore } from '../store/useChatStore';
import NoConversationPlaceholder from './NoConversationPlaceholder';
import { useEffect } from 'react';

function ChatContainer() {
    const { getMessagesByUserId, selectedUser } = useChatStore();

    if (!selectedUser) return  <NoConversationPlaceholder />;
    const { messages } = useChatStore();

    useEffect(()=> {
        getMessagesByUserId(selectedUser._id);
    }, [selectedUser?._id, getMessagesByUserId])

    if (messages.length === 0) {
        return (
            <div className='flex-1 flex items-center justify-center'>
                <p className='text-gray-400'>No messages yet. Start the conversation!</p>
            </div>
        );
    }
  return (
    
    <>
    {messages.map((message) => (
        <div key={message._id} className={`flex flex-col max-w-xs p-2 rounded-lg ${message.senderId === selectedUser._id ? 'bg-blue-500 self-start' : 'bg-green-500 self-end'}`}>
            {message.text && <p className='text-white'>{message.text}</p>}
            {message.image && <img src={message.image} alt="sent image" className='mt-2 rounded' />}
        </div>
    ))}   
    </>
  )
}

export default ChatContainer