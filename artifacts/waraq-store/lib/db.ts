import mongoose from 'mongoose';

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalMongoose = globalThis as typeof globalThis & {
  __waraqMongoose?: MongooseCache;
};

const cache =
  globalMongoose.__waraqMongoose ??
  (globalMongoose.__waraqMongoose = { connection: null, promise: null });

export async function connectDB() {
  if (cache.connection) return cache.connection;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is required to connect to MongoDB Atlas.');
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    });
  }

  try {
    cache.connection = await cache.promise;
    return cache.connection;
  } catch (cause) {
    cache.promise = null;
    throw new Error(
      'MongoDB Atlas connection failed. Check the connection secret and Atlas network access.',
      { cause },
    );
  }
}
