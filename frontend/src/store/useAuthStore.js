import { create } from 'zustand'
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';
// if we want to create a state in react, we should use useState hook
// but if we want to create a global state that can be accessed from any component, 
// we should use a state management library like Redux or Zustand. 
// In this case, we will use Zustand to create a global state for authentication.

export const useAuthStore = create((set) => ({
    // set is for updating the state
    // get is for getting the current state
    authUser: null,
    isCheckingAuth: true,    
    isSigningUp: false,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get('/auth/check-auth');
            // the response going to have a user object if the user is authenticated
            const data = response.data;
            set({ authUser: data.user});
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
            // show a success message to the user, with fancy toast notification
            toast.success("Account created successfully!");
        } catch (error) {
            // if the error is from the backend, it will have a response object with a message
            // lets accest the error.response from axios and show the message to the user
            toast.error(error.response?.data?.message || "Failed to create account");
        } finally {
            set({ isSigningUp: false });
        }
    }
}))