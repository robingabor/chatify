 // models is for communicating with our users and our database
// User model represents the users collection in the database
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profilePic: {
        type: String,
        default: ''
    },
}, { timestamps: true }); // this will add createdAt and updatedAt fields automatically

export const User = mongoose.model('User', userSchema);