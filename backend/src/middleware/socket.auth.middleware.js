import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";
import { User } from "../models/User.js";

export const socketAuthMiddleware = async (socket, next) => {
    // the socket is basically is the user's connection to the server
    try {
        // extract the token from the http cookie
        // const token = socket.handshake.auth.token;
        const token = socket.handshake.headers.cookie
            ?.split("; ")
            .find(cookie => cookie.trim().startsWith("jwt="))
            ?.split("=")[1];

        if (!token) {
            console.log("Socket connection rejected: No token provided");
            return next(new Error("Unauthorized: No token provided"));
        }
        // verify the token and extract the user ID
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if (!decoded || !decoded.userId) {
            console.log("Socket connection rejected: Invalid token");
            return next(new Error("Unauthorized: Invalid token"));
        }
        // find the user from db
        const user = await User.findById(decoded.userId);
        if (!user) {
            console.log("Socket connection rejected: User not found");
            return next(new Error("Unauthorized: User not found"));
        }
        // attach the user to the socket connection for future use
        socket.user = user;
        socket.userId = user._id.toString();
        console.log(`Socket connection authenticated for user: ${user.username} (${user._id})`);
        next();
    } catch (error) {
        console.error("Error occurred while verifying token:", error);
        return next(new Error("Unauthorized: Invalid token"));
    }
};