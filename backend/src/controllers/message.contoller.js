import { Message } from "../models/Message.js";
import { User } from "../models/User.js";
import { cloudi } from "../lib/cloudinary.js";

export const getAllContacts = async (req, res) => {
  try {
    // this id is coming from the middleware
    const loggedInUserId = req.user._id;
    // we want all the users from the user collection except ourself
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllContacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    // req.params contains the dinamic parameters in the url
    const {userid:userToChatid} = req.params;
    // we want to get all the messages between the logged in user and the user we want to chat with
    // there can be 2 cases: either the logged in user is the sender
    // or the logged in user is the receiver
    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId: userToChatid },
        { senderId: userToChatid, receiverId: loggedInUserId }
      ]
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessagesByUserId:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    // first lets get the data from the request(text, image, receiverId, logged in user id)
    const { text, image } = req.body;
    const senderId = req.user._id;
    const { userId: receiverId } = req.params;

    if (!text && !image) {
      return res.status(400).json({ message: "Message text or image is required" });
    }
    if(receiverId === senderId.toString()) {
      return res.status(400).json({ message: "You cant send a message to yourself" });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver user not found" });
    }

    let imageUrl;
    if (image) {
      const uploadedImage = await cloudi.uploader.upload(image);
      imageUrl = uploadedImage.secure_url;      
    }
    // lets create a new Message 
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl || null
    });
    // save the Message to the database
    await newMessage.save();
    
    // REST API: No real-time notification via Socket.io
    // Frontend will poll for new messages
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};
// in the db we want to find all the messages, where either we are the sender
// or the receiver, then we want to get the distinct sender and receiver ids
export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    // we want to get all the messages where we are the logged in user is the sender or the receiver
    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId },
        { receiverId: loggedInUserId }
      ]
    });

    // set is a data structure that only allows unique values,
    // so we cant have the same user id twice
    const chatPartnerId = [...new Set(messages.map(message => {
      if (message.senderId.toString() === loggedInUserId.toString()) {
        // if we are the sender, then the chat partner is the receiver
        return message.receiverId.toString();
      } else {
        // if we are the receiver, then the chat partner is the sender
        return message.senderId.toString();
      }
    }))];
    // we want to get the user details for each chat partner
    const filteredUsers = await User.find({ _id: { $in: chatPartnerId } }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getChatPartners:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};
