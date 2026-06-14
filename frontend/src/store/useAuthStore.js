import { create } from 'zustand'
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';
import {io} from "socket.io-client"
// if we want to create a state in react, we should use useState hook
// but if we want to create a global state that can be accessed from any component, 
// we should use a state management library like Redux or Zustand. 
// In this case, we will use Zustand to create a global state for authentication.

const BASE_URL = import.meta.env.MODE === "developement" ? "http://localhost:3000" : "/"; 

export const useAuthStore = create((set, get) => ({
    // set is for updating the state
    // get is for getting the current state
    authUser: null,
    isCheckingAuth: true,    
    isSigningUp: false,
    isLoggingIn: false,
    socket: null,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get('/auth/check-auth');
            // the response going to have a user object if the user is authenticated
            set({ authUser: response.data});
            // connect to the socket server when the user is authenticated
            get().connectSocket();
        } catch (error) {
            console.error("Error checking auth:", error);
            set({ authUser: null});
        }finally {
            set({ isCheckingAuth: false });
        }

    },
    signup: async (formData) => {
        // formdata must contain fullName, email and password
        set({ isSigningUp: true });
        try {
            const response = await axiosInstance.post('/auth/signup', formData);
            const data = response.data;
            set({ authUser: data.user });
            // connect to the socket server when the user signs up
            get().connectSocket();
            // show a success message to the user, with fancy toast notification
            toast.success("Account created successfully!");
        } catch (error) {
            // if the error is from the backend, it will have a response object with a message
            // lets accest the error.response from axios and show the message to the user
            toast.error(error.response?.data?.message || "Failed to create account");
        } finally {
            set({ isSigningUp: false });
        }
    },
    login: async (formData) => {
        set({ isLoggingIn: true });
        try {
            const response = await axiosInstance.post('/auth/login', formData);
            const data = response.data;
            set({ authUser: data.user });
            // connect to the socket server when the user logs in
            get().connectSocket();
            toast.success("Logged in successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to login");
        } finally {
            set({ isLoggingIn: false });
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            // disconnect from the socket server when the user logs out
            get().disconnectSocket();
            toast.success("Logged out successfully!");
        } catch (error) {
            toast.error("Failed to logout");
        }
    },
    updateProfile: async (data) => {
        try {
            const response = await axiosInstance.put('/auth/update-profile', data);
            const responseData = response.data;
            set({ authUser: responseData.user });
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
    },
    connectSocket: () => {
        const {authUser} = get();
        // if we are already connected or there is not auth user
        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {        
            withCredentials: true, // to send cookies with the socket connection
        });
        // connect  to the socket server, and we want to send the token in the cookie for authentication
        socket.connect();

        set({ socket : socket });

        // Listen for the 'getOnlineUsers' event from the backend to update the online users list
        socket.on('getOnlineUsers', (userIds) => {
            set({ onlineUsers: userIds });
        });
        },
        disconnectSocket: () => {
            if(get().socket.connected){
                get().socket?.disconnect();
                set({ socket: null, onlineUsers: [] });
            }
        }

})) 