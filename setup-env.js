#!/usr/bin/env node

/**
 * Helper script to set up .env file with MongoDB Atlas connection string
 * Usage: node setup-env.js "your-connection-string"
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const envPath = path.join(__dirname, '.env');

function createEnvFile(connectionString, port = 3000) {
    // Make sure connection string includes database name
    let mongoUri = connectionString.trim();
    if (!mongoUri.includes('mongodb://') && !mongoUri.includes('mongodb+srv://')) {
        console.error('❌ Invalid connection string. Must start with mongodb:// or mongodb+srv://');
        process.exit(1);
    }

    // Add database name if not present
    if (!mongoUri.includes('/addiction-free') && !mongoUri.match(/\/[^?]+(\?|$)/)) {
        mongoUri = mongoUri.replace(/\?/, '/addiction-free?').replace(/(mongodb\+srv?:\/\/[^\/]+)$/, '$1/addiction-free');
        if (!mongoUri.includes('/addiction-free')) {
            mongoUri += '/addiction-free';
        }
    }

    const envContent = `# MongoDB Atlas Connection String
MONGODB_URI=${mongoUri}

# Server Port (optional, defaults to 3000)
PORT=${port}
`;

    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
    console.log(`📦 MongoDB URI: ${mongoUri.replace(/:[^:@]+@/, ':****@')}`); // Hide password
    console.log(`🚀 Server will run on port: ${port}`);
    console.log('\n💡 Next steps:');
    console.log('   1. Install dependencies: npm install');
    console.log('   2. Start the server: npm start');
    console.log('   3. Open: http://localhost:3000');
}

// Check if connection string provided as argument
if (process.argv[2]) {
    createEnvFile(process.argv[2], process.argv[3] || 3000);
    process.exit(0);
}

// Interactive mode
console.log('🔧 MongoDB Atlas Connection Setup\n');
console.log('Please paste your MongoDB Atlas connection string.');
console.log('It should look like: mongodb+srv://username:password@cluster.mongodb.net/\n');

rl.question('Connection String: ', (connectionString) => {
    rl.question('Port (press Enter for 3000): ', (port) => {
        createEnvFile(connectionString, port || 3000);
        rl.close();
    });
});

