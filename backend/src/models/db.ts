import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connStr = process.env.DATABASE_URL || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/team_task_manager";
    const maskedUrl = connStr.replace(/:[^:@]+@/, ":****@");
    console.log(`Connecting to MongoDB at: ${maskedUrl}`);

    await mongoose.connect(connStr);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
