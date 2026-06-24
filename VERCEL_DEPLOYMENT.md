# Vercel Deployment Guide for Chatify

## ✅ Changes Made

I've configured your MERN app for Vercel deployment. Here's what was modified:

### 1. **Fixed `backend/src/lib/db.js`**
- Added connection pooling with `maxPoolSize` and `minPoolSize`
- Implemented connection state checking to prevent multiple connections
- Removed `process.exit(1)` (incompatible with serverless)
- Now reuses existing MongoDB connections across requests

### 2. **Created `backend/api/index.js`** (Vercel Entry Point)
- Serverless-compatible Express app without `server.listen()`
- Imports routes and middleware from original code
- Exports app for Vercel Serverless Functions
- Includes health check endpoint (`/api/health`)

### 3. **Updated `vercel.json`**
- Points backend to `backend/api/index.js` (not `server.js`)
- Routes `/api/*` to backend serverless function
- Routes static files to frontend built dist folder
- Configured for Vite (distDir: "dist")

### 4. **Updated root `package.json`**
- Vercel automatically runs `npm run build`
- Build script now builds the frontend from root

---

## ⚠️ Important: Socket.io Limitation

**Vercel Serverless does NOT support WebSockets/Socket.io.**

Your app uses Socket.io for real-time chat. You have **2 options**:

### Option A: Deploy Backend to Render/Railway (RECOMMENDED for chat features)
- Keep Vercel for frontend only
- Deploy backend to [Render.com](https://render.com) or [Railway.app](https://railway.app)
- Your current `server.js` works as-is on these platforms
- Chat with Socket.io works perfectly

### Option B: Deploy Everything to Vercel (No real-time chat)
- Remove Socket.io dependencies
- Use REST polling instead
- Works immediately with current setup

---

## 🚀 Deployment Steps

### Prerequisites
1. Push code to GitHub/GitLab
2. Have environment variables ready:
   - `MONGO_URI` - MongoDB Atlas connection string
   - `JWT_SECRET` - Your JWT secret key
   - `RESEND_API_KEY` - Email service API key
   - `EMAIL_FROM` - Sender email address
   - `CLIENT_URL` - Your frontend URL
   - Other API keys (Cloudinary, Arcjet, etc.)

### For Frontend + Backend REST API (Vercel Only)

1. **Connect GitHub repo to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Add Environment Variables**
   - Settings → Environment Variables
   - Add all variables from your `.env` file

3. **Deploy**
   - Vercel will automatically:
     - Run `npm run build` (builds frontend)
     - Deploy backend as serverless functions
     - Route `/api/*` to backend
     - Serve frontend static files

### For Full Real-Time Chat (Backend on Render/Railway, Frontend on Vercel)

**Deploy Frontend to Vercel:**
- Same steps as above (use `/frontend` folder)
- Set `CLIENT_URL` to your Vercel frontend domain

**Deploy Backend to Render:**
1. Create free account at [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo (use `/backend` folder)
4. Set environment variables
5. Deploy - your `server.js` works as-is

**Update Frontend API URLs:**
- Change API calls from `http://localhost:5000` to your Render backend URL
- Update `VITE_API_URL` or similar in frontend env

---

## 📝 Environment Variables Needed

Create a `.env.production` or add to Vercel:

```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
JWT_SECRET=your-secret-key-here
NODE_ENV=production
CLIENT_URL=https://your-vercel-domain.vercel.app
RESEND_API_KEY=your-resend-key
EMAIL_FROM=noreply@yourapp.com
EMAIL_FROM_NAME=Chatify
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
ARCJET_KEY=your-arcjet-key
ARCJET_ENV=production
```

---

## 🧪 Testing Locally

Before deploying, test locally:

```bash
# Terminal 1: Start backend
cd backend
npm install
npm start

# Terminal 2: Start frontend (in new terminal)
cd frontend
npm install
npm run dev
```

---

## ❓ Which Option Should You Choose?

| Feature | Vercel Only | Render/Vercel |
|---------|-----------|--------------|
| Cost | Free | Free tier available |
| Real-time chat | ❌ No | ✅ Yes |
| WebSockets | ❌ No | ✅ Yes |
| Setup complexity | Simple | Moderate |
| Scaling | Automatic | Manual |

---

## 🔗 Quick Links

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas

## 📞 Common Issues

**"502 Bad Gateway"** → Check environment variables in Vercel dashboard
**"CORS Error"** → Ensure `CLIENT_URL` env var is set correctly
**"Connection timeout"** → Verify MongoDB connection string is correct
**"Socket.io not working"** → Deploy backend to Render/Railway instead

---

## Summary

✅ Your backend is now Vercel-compatible
✅ Frontend will build and deploy to Vercel
⚠️ Socket.io won't work on Vercel (choose Render/Railway for backend if needed)
✅ Database connection pooling is configured
✅ Ready for production deployment
