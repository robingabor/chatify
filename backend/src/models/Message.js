// sender-> the sendetId going to be a user id coming from the user collection
// receiver -> the receiverId going to be a user id coming from the user collection
// text
// image
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    // the sender id going to be an id, coming from the user model
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // the reciever id going to be an id, coming from the user model
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // a message can be either a text or a image, cant be both
    text: {
        type: String,
    },
    image: {
        type: String,
    }
}, { timestamps: true }); // createdAt and updatedAt

export const Message = mongoose.model('Message', messageSchema);