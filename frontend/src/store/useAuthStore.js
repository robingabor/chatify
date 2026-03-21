import { create } from 'zustand'    
// if we want to create a state in react, we should use useState hook
// but if we want to create a global state that can be accessed from any component, 
// we should use a state management library like Redux or Zustand. 
// In this case, we will use Zustand to create a global state for authentication.

export const useAuthStore = create((set) => ({
    // set is for updating the state
    // get is for getting the current state
    authUser: {name:"John Doe", _id:"1234567890", age: 30, email: "john.doe@example.com"},
    isLoading: false,
    isLoogedIn: false,
    // here comes the actions
    login: () => {
        console.log("Logging in");
        set({isLoggedIn: true, isLoading: true});
    },
    logout: () => {
        console.log("Logging out");
        set({isLoggedIn: false, isLoading: false});
    },
    signup: (name, email, password) => {
        console.log("Signing up with name:", name, "email:", email, "and password:", password);
    }    
}))