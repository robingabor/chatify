import { create } from 'zustand'
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
    allContacts: [],
    // our chat partners
    chats: [],
    // the messages of the current chat with the selected user
    messages: [],
    // activeTab is for the UI, to know which tab is active, contacts or chats
    activeTab: "chats",
    // the user we are currently chatting with
    selectedUser: null, 
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

    toggleSound: () => {
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
        set({ isSoundEnabled: !get().isSoundEnabled });
    },
    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedUser: (user) => set({ selectedUser: user }),
    getAllContacts: async () => {
        set({ isUsersLoading: true });
        try {
            const response = await axiosInstance.get('/messages/contacts');
            // the response going to  have all the users from the user collection except ourself
            set({ allContacts: response.data });
        } catch (error) {
            console.error("Error fetching contacts:", error);
            toast.error(error.response?.data?.message || "Failed to fetch contacts");
        }finally {
            set({ isUsersLoading: false });
        }
    },
    // users we have chatted with
    getMyChatPartners: async () => {
        set({ isUsersLoading: true });
        try {
            const response = await axiosInstance.get('/messages/chats');
            // the response going to have all the users we have chatted with
            set({ chats: response.data });
        } catch (error) {
            console.error("Error fetching chat partners:", error);
            toast.error(error.response?.data?.message || "Failed to fetch chat partners");
        }
        finally {
            set({ isUsersLoading: false });
        }
    },
    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const response = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: response.data });
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error(error?.response?.data?.message || "Failed to fetch messages");
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        const { authUser } = useAuthStore.getState();
        
        // optimistic UI update: we add the message to the messages array before getting the response from the backend
        const tempId = `temp-${Date.now()}`; // temporary id for optimistic UI update
        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true, // flag to identify optimistic messages
        };
        // immediately update the ui
        set({ messages: [...messages, optimisticMessage] });
        try {
            const response = await axiosInstance.post(`/messages/send123/${selectedUser._id}`, messageData);
            // the latest message going to be added to the end
            set( { messages: messages.concat(response.data) } );
        } catch (error) {
            console.error("Error sending message:", error);
            // if there is an error, we need to get rid of the optimistic message
            set({ messages: messages });
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    }
}));       