import express from 'express';

import path from 'path';
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from './lib/db.js';
import { ENV } from "./lib/env.js";

const app = express();
// we need to configure some thing to be able to deploy on sevalla
const __dirname = path.resolve(); // to get the current directory's absolute path

const port = ENV.PORT || 3000;   

app.use(express.json()); // to parse JSON request bodies (req.body)
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

// connectDB()
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`Server is running on ${port}`);
//     });
//   })
//   .catch((err) => {
//     console.error('Failed to connect to the database:', err);
//     process.exit(1); // Exit the process with failure
//   });
server.listen(PORT, async () => {
  console.log("Server running on port: " + PORT);
  await connectDB();
});