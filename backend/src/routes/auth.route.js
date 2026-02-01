import express from 'express';
import { signup, login, logout, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);
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
router.get("/check-auth", protectRoute, (req, res) => {
    res.status(200).json(req.user);
});

export default router;