import { create } from 'zustand'
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

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
    }

}));