import mongoose from 'mongoose';
import dns from 'node:dns';

// Configure reliable DNS servers for MongoDB Atlas SRV lookups on Windows & local ISPs
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (dnsErr) {
  // Silently fall back to system DNS if restricted
}

/**
 * Global cached mongoose instance for serverless hot-reloading resilience.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

/**
 * Connect to MongoDB Atlas cluster using a singleton pattern.
 * Prevents connection leakages during Next.js serverless and development rebuilds.
 * 
 * @returns {Promise<mongoose.Connection>}
 */
export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  const rawUri = process.env.MONGODB_URI;

  if (!rawUri || !rawUri.trim()) {
    throw new Error(
      'Missing MONGODB_URI environment variable. Please check your .env.local file.'
    );
  }

  const mongoUri = rawUri.trim();

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose
      .connect(mongoUri, opts)
      .then((mongooseInstance) => {
        return mongooseInstance.connection;
      })
      .catch((error) => {
        cached.promise = null;
        console.error('MongoDB connection failure:', error?.message || error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
