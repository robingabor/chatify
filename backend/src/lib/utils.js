import jwt from 'jsonwebtoken';
import {ENV} from './env.js';

// jwt is used to generate tokens for user authentication
// hey you are authenticated, just keep this token with you
export const generateToken = (userId, res) => {
    const { JWT_SECRET, NODE_ENV } = ENV;
    if(!JWT_SECRET) {
        throw new Error('JWT_SECRET is not set in environment variables');
    }
    const token = jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: '7d' // token will expire in 7 days
    });    
    // res is needed to send the generated jwt token
    // back to the client via cookies
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // prevents client-side JS from accessing the cookie, xss aattack protection
        sameSite: "strict", // CSRF attack protection
        // in production, cookies should only be sent over HTTPS
        // http://localhost:3000 -> false
        // https://myapp.com -> true
        secure: NODE_ENV === "production"
    });
    
    return token;
}
