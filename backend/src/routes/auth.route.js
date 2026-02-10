import express from 'express';
import { signup, login, logout, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import arcjetProtection from '../middleware/arcjet.middleware.js';

const router = express.Router();

router.use(arcjetProtection); // apply Arcjet protection to all routes in this router

router.get('/test', arcjetProtection, (req, res) => {
    res.status(200).json({ message: 'Test route is protected by Arcjet!' });
});
router.post('/signup',  signup);

router.post('/login',  login);

router.post('/logout',  logout);
// MIDDLEWARE is a function that runs between the request and the response
// if the user is authenticated, only then they can call the next function
// if not authenticated, protectRoute will throw an error, and cant proceed to next function
// user send a req
// protectRoute checks if authenticated 
// -checks token in cookie, and confirm it's valid)
// if not, sends error response back to user(401 Unauthorized)
// if yes, calls next() -> updateProfile, and sends response back to user
router.put("/update-profile", protectRoute, updateProfile);

// after a refresh for example, check if the user is logged authenticated
router.get("/check-auth",  protectRoute, (req, res) => {
    res.status(200).json(req.user);
});
// rate limiting: is a way to control how often, someone can do something,
// om a website or app, like how many times, they can refresh a page
// make a request to an API, or try to log in, in a certain amount of time
// the request will be filtered out if we should accept or rejectf
// this is to prevent abuse, like someone trying to brute force attack, or overload the server with too many requests
// for example 1000 login attempts in a minute
// this protects the servers from being overwhelmed
// status code 429 means too many requests, and the user should slow down
export default router;