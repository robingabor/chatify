import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

// This middleware will run for every request and apply the Arcjet rules
const arcjetProtection = async (req, res, next) => {
    try {
        // first we check if if we would accept the request,
        // based on the rules we set up in lib/arcjet.js
        const decision = await aj.protect(req);
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ message: "Rate limit exceeded. Please try again later." });
            }
            else if (decision.reason.isBot()) {
                return res.status(403).json({ message: "Forbidden - Bot Detected" });
            }else {
                return res.status(403).json({ message: "Access Denied by security rules" });
            }
        }
        // check for spoofed bots using Arcjet's inspect library
        // spoofed bots are bots that try to disguise themselves as legitimate users,
        // by changing their user agent, IP address, or other characteristics
        if (isSpoofedBot(req)) {
            return res.status(403).json({ 
                error: "Spoofed bot detected." ,
                message: "Forbidden - Spoofed Bot Detected" });
        }
        // if the request is allowed, we proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Arcjet Protection Error:", error);
        next();
    }
};
export default arcjetProtection;