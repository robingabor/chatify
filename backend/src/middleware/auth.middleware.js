import jwt from 'jsonwebtoken';
import { ENV } from '../lib/env.js';
import { User } from '../models/User.js';

export const protectRoute = async (req, res, next) => {
    // first, check if the token is present in cookies
    try {
        // we need cookie parser middleware to parse cookies
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - No token provided' });
        }
        const { JWT_SECRET } = ENV;
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'invalid token' });
        }
        // exclude password field
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // attach user info to req object. we can access it in next middlewares/controllers
        req.user = user; 
        // proceed to the next middleware/controller , wich will be updateProfile method
        next();
    } catch (error) {
        console.log('Error in protectRoute middleware:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};