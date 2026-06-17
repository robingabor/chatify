import {Server} from 'socket.io';
import http from 'http';
import express from 'express';
import {ENV} from './env.js';
import {socketAuthMiddleware} from '../middleware/socket.auth.middleware.js';

// socket is for real-time communication between the client and the server
// it allows us to send and receive messages in real-time without the need 
// for the client to continuously poll the server for updates

const app = express();
// Create an HTTP server and wrap the Express app
const server = http.createServer(app);

// Create a Socket.IO server and attach it to the HTTP server
const io = new Server(server, {
    cors: {
        origin: ENV.CLIENT_URL, // Allow requests from the client URL
        credentials: true // Allow cookies to be sent with requests
    }
});
// we want to get the socket id of the user we want to send
// a message to, so we can send the message to that specific user
export function getRecieverSocketId(userId) {
    return userSocketMap.get(userId) || null;
}

// authentication middleware for socket.io connections
io.use(socketAuthMiddleware);

// this is for using online users
const userSocketMap = new Map(); // Map to store userId: socket pairs
// Handle socket connections
io.on('connection', (socket) => {
    console.log(`A User connected: ${socket.user.username} (${socket.user._id})`);
    // const userId = socket.userId;
    const sockets = userSocketMap.get(socket.user._id) ?? new Set();
    sockets.add(socket);
    userSocketMap.set(socket.user._id, sockets);
    // Update the online users list
    // we want to send this event everyone in our app, regarding the online users
    // io.emit is used to send events 
    io.emit('getOnlineUsers', Array.from(userSocketMap.keys()));

    // socket.on  we listen for event from the client
    socket.on('disconnect', () => {
        console.log(`A User disconnected: ${socket.user.username} (${socket.user._id})`);
        // Remove the user from the online users list
        userSocketMap.delete(socket.user._id);
        // Notify all clients about the updated online users list
        io.emit('getOnlineUsers', Array.from(userSocketMap.keys()));
    });
    
});

export {io, app, server}