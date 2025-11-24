# 🚀 Setup Instructions - MongoDB Backend

This guide will help you set up the Addiction Free app with MongoDB backend for permanent data storage.

## Prerequisites

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - Choose one option:
   - **Option A**: MongoDB Atlas (Cloud - Free) - Recommended
   - **Option B**: Local MongoDB Installation

## Step 1: Install Dependencies

Open terminal in the project folder and run:

```bash
npm install
```

This will install:
- Express (web server)
- Mongoose (MongoDB driver)
- CORS (cross-origin requests)
- Other dependencies

## Step 2: Set Up MongoDB

### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Add database name: `addiction-free`

### Option B: Local MongoDB

1. Install MongoDB locally: [Download](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Default connection: `mongodb://localhost:27017/addiction-free`

## Step 3: Configure Environment

1. Create a `.env` file in the project root:

```bash
# For MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/addiction-free

# OR for Local MongoDB
# MONGODB_URI=mongodb://localhost:27017/addiction-free

# Optional: Change port (default is 3000)
PORT=3000
```

**Important**: Replace `username` and `password` with your actual MongoDB credentials!

## Step 4: Start the Server

```bash
# Development mode (auto-restarts on changes)
npm run dev

# OR Production mode
npm start
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3000
```

## Step 5: Access the App

Open your browser and go to:
```
http://localhost:3000
```

The app will now:
- ✅ Store all data in MongoDB (permanent storage)
- ✅ Sync across devices/browsers
- ✅ Never lose data even after closing browser
- ✅ Work offline with localStorage fallback

## Troubleshooting

### MongoDB Connection Issues

**Error: "MongoDB connection error"**

1. Check if MongoDB is running (for local installation)
2. Verify your connection string in `.env`
3. For Atlas: Make sure your IP is whitelisted (use `0.0.0.0/0` for testing)
4. Check username/password are correct

### Server Won't Start

1. Make sure port 3000 is not in use
2. Check Node.js is installed: `node --version`
3. Reinstall dependencies: `rm -rf node_modules && npm install`

### Data Not Saving

1. Check browser console for errors
2. Verify server is running
3. Check MongoDB connection in server logs

## Features

Once set up, your data will:
- 📦 Be stored permanently in MongoDB
- 🔄 Sync automatically when you use the app
- 🌍 Be accessible from any device/browser
- 💾 Be backed up in the cloud (if using Atlas)
- 🔒 Stay private (only you can access your data)

## Development vs Production

### Development Mode
```bash
npm run dev
```
- Auto-restarts on code changes
- Better error messages

### Production Mode
```bash
npm start
```
- Optimized for performance
- For deployment

## Next Steps

1. Create your first profile
2. Start tracking your recovery journey
3. Data will be saved permanently to MongoDB!
4. Access from any device using the same server

---

**Need Help?** Check the browser console (F12) and server logs for error messages.

