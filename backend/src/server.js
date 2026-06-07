import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors'
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from './lib/db.js';
import { ENV } from "./lib/env.js";

const app = express();
// we need to configure some thing to be able to deploy on sevalla
const __dirname = path.resolve(); // to get the current directory's absolute path

const port = ENV.PORT || 3000;   

// allow frontend to send cookies to our backend - must be before express.json()
app.use(cors({origin:ENV.CLIENT_URL, credentials:true}))
app.use(express.json({ limit: '5mb' })); // to parse JSON request bodies (req.body) with increased limit for image uploads
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(cookieParser()); // to parse cookies from incoming requests
// we can get the fields the user sends
// lets use the auth, this is an application level middleware
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

if (ENV.NODE_ENV === 'production') {
  // In production, after you build your React frontend (npm run build), 
  // it creates a dist folder with optimized files. This code tells your Express
  // server to serve those files directly, allowing users to access your frontend
  // through the same server (no need for separate servers). In development, you 
  // typically run the frontend separately with its own dev server.

  // When you use app.use(express.static(path)), Express automatically looks for
  //  matching files in that folder before checking your route handlers.
  // Request: GET /styles.css -> express checks /frontend/dist/styles.css
  // Request: GET /api/auth/login (doesn't match a file)
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // any other route, we will serve index.html
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}
app.listen(port, async () => {
  console.log("Server running on port: " + port);
  await connectDB();
});