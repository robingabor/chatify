import {User} from '../models/User.js';
import bcrypt  from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
export const signup = async (req, res) => {
    // we want to get the data the user sent via req.body
    // without using a middleware like express.json(), req.body will be undefined
    const { fullName, email, password } = req.body;
    
    try {
        // before saving the user, lets do some checks
        // first lets check if all fields are provided
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // next lets check the password length
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        // check if the email is valid (simple regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        // lets check if the user already exists in the database
        // the passed proprty could : {email: email} but 
        // in ES6 if the key and value are the same name we can just write once
        const user = await User.findOne({email});
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        } 
        // elsewhere, we take the psw and hash it before saving to the database
        // 123456 -> asdlfkjasdlfkj234234 -> saved in db, unreadable
        // generate a salt, 10 decides how long the salt will be, also complexity
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword =  await bcrypt.hash(password, salt);
        // create a new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });
        if(newUser) {
            // save the user to the database
            await newUser.save();            
            // autenticate the user
            generateToken(newUser.P_id, res);
            // 201 means something is created
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName, 
                email: newUser.email,
                profilePic: newUser.profilePic
            });
            // send a welcome email to the user

        }else {
            return res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.log('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
} 
