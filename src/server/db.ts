import mongoose, { type MongooseOptions } from "mongoose";

import { env } from "~/env.js";

declare global {
  var _mongoosePromise: Promise<typeof mongoose>;
  var _clientPromise: Promise<mongoose.mongo.MongoClient>;
}

const uri = env.DATABASE_URI;
const options: MongooseOptions = {};

const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose; // If already connected, return the existing connection
  }

  return await mongoose.connect(uri, options);
};

// Initialize connection promises based on environment
export let mongoosePromise: Promise<typeof mongoose>;
export let clientPromise: Promise<mongoose.mongo.MongoClient>;

if (env.NODE_ENV === "development") {
  // In development, reuse the connection across module reloads
  if (!global._mongoosePromise) {
    const mongooseConnection = connectToDatabase();
    global._mongoosePromise = mongooseConnection;
    global._clientPromise = mongooseConnection.then((mongoose) =>
      mongoose.connection.getClient(),
    );
  }

  mongoosePromise = global._mongoosePromise;
  clientPromise = global._clientPromise;
} else {
  // In production, create a new connection
  const mongooseConnection = connectToDatabase();
  mongoosePromise = mongooseConnection;
  clientPromise = mongooseConnection.then((mongoose) =>
    mongoose.connection.getClient(),
  );
}
