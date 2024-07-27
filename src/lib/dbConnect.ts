// import mongoose from 'mongoose';

// interface ConnectionObject {
//     isConnected?: number;
// }

// const connection: ConnectionObject = {};

// async function dbConnect(): Promise<void> {
//     if (connection.isConnected) {
//         return;
//     }

//     try {
//         const db = await mongoose.connect(process.env.MONGODB_URI
//             || '', {});

//         connection.isConnected = db.connections[0].readyState;


//         // Add event listener to handle disconnections
//         db.connection.on('disconnected', () => {
//             console.log('MongoDB disconnected!');
//             connection.isConnected = 0;
//         });

//         console.log('db connected successfully');
//     } catch (error) {
//         console.error('Database connection failed', error);
//     }
// }

// export default dbConnect;


import mongoose from 'mongoose';

// Your MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://abhinavparashar486:78198720@cluster0.tiahmng.mongodb.net/';

// Interface for the environment variables
interface Env {
    MONGODB_URI: string;
}

// Check if the connection string is provided
if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    );
}

declare global {
    var mongoose: any;
}

// Global variable to maintain the connection state
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;
