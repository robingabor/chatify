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

// authentication middleware for socket.io connections
io.use(socketAuthMiddleware);

// this is for using online users
const userSocketMap = {}; // Map to store userid: Socket pairs
// Handle socket connections
io.on('connection', (socket) => {
    console.log(`A User connected: ${socket.user.username} (${socket.user._id})`);
    const userId = socket.userId;
    // Update the online users list
    userSocketMap[userId] = socket;
    // we want to send this event everyone in our app, regarding the online users
    // io.emit is used to send events 
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    // socket.on  we listen for event from the client
    socket.on('disconnect', () => {
        console.log(`A User disconnected: ${socket.user.username} (${socket.user._id})`);
        // Remove the user from the online users list
        delete userSocketMap[userId];
        // Notify all clients about the updated online users list
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
    
});

export {io, app, server}