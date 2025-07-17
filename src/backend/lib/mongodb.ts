import mongoose, { Mongoose } from 'mongoose';
import { MONGODB_URL } from './config';


if (!MONGODB_URL) {
  throw new Error('Please define the MONGODB_URL environment variable inside .env.local');
}

// Define global type for caching
interface MongooseGlobalCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Attach to globalThis safely
const globalWithMongoose = globalThis as typeof globalThis & {
  _mongoose: MongooseGlobalCache;
};

let cached = globalWithMongoose._mongoose;

if (!cached) {
  cached = globalWithMongoose._mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URL as string, opts);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
