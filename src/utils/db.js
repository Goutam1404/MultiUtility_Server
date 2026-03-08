import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    // console.log(`${process.env.MONGODB_URL}`);
    // console.log(`${process.env.PORT}`);
    
    await mongoose.connect(`${process.env.MONGODB_URL}`);
    console.log("✅ Database connection successfull");
  } catch (error) {
    console.log("❌Error in connecting Db =>", error);
    process.exit(1);
  }
};
