import express from "express";
import 
  {getAllContacts, getMessagesByUserId, sendMessage, getChatPartners}
 from "../controllers/message.contoller.js";
 import {protectRoute} from "../middleware/auth.middleware.js"
import arcjetProtection from "../middleware/arcjet.middleware.js";

const router = express.Router();
// first we apply the Arcjet protection to all the routes in this router,
// then we apply the protectRoute middleware to all the routes in this router, 
// so that only authenticated users can access these routes
router.use(arcjetProtection,protectRoute);
// get the contacts, there gonna be a "contacts" tab
router.get('/contacts', getAllContacts);
// tge chats we have with other people
router.get('/chats', getChatPartners);
// get the messages with a specific user,
// the id is the user id of the other user
router.get('/:userid', getMessagesByUserId);
// send message to a specific user, the id is the user id of the other user
router.post('/send/:userId', sendMessage);

export default router;