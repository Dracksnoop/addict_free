# 🔗 MongoDB Atlas Connection Setup

## Quick Setup

### Step 1: Get Your Connection String
From MongoDB Atlas dashboard:
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

### Step 2: Set Up .env File

**Option A: Use the setup script**
```bash
node setup-env.js
```
Paste your connection string when prompted.

**Option B: Edit .env file manually**
1. Open `.env` file in your editor
2. Replace the placeholder with your connection string:
```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/addiction-free
```

**Option C: Command line**
```bash
node setup-env.js "mongodb+srv://username:password@cluster.mongodb.net/addiction-free"
```

### Step 3: Verify Connection String Format

Your connection string should:
- Start with `mongodb+srv://` (Atlas) or `mongodb://` (local)
- Include username and password
- End with `/addiction-free` (database name) or we'll add it automatically

Example:
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/addiction-free
```

### Step 4: Test the Connection

1. Install dependencies: `npm install`
2. Start server: `npm start`
3. Look for: `✅ Connected to MongoDB`

## Important Notes

⚠️ **Security**: Never commit `.env` file to Git (already in .gitignore)

⚠️ **IP Whitelist**: Make sure your IP is whitelisted in MongoDB Atlas:
- Go to Network Access in Atlas
- Add your current IP (or use `0.0.0.0/0` for testing)

⚠️ **Database User**: Create a database user in Atlas with read/write permissions

## Troubleshooting

**"MongoDB connection error"**
- Check your connection string is correct
- Verify username/password
- Ensure IP is whitelisted in Atlas
- Check if cluster is running

**"Authentication failed"**
- Verify database user credentials
- Make sure user has proper permissions

## Next Steps

Once connected:
1. ✅ Data will save permanently to MongoDB
2. ✅ Can access from any device
3. ✅ Data persists across browser sessions
4. ✅ Never lose your recovery progress!

