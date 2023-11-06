import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("MongoDB is connected");
  } catch (error) {
    console.log("Unable to connect to MongoDB - " + error);
    process.exit(1);
  }
};

export default connectDB;
