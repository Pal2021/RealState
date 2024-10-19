import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      `mongodb+srv://pal2021:pal2021@cluster0.612nkeu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log(
      `\n Mongodb connected !! DB Host: ${connection.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connnection error !!!!", error);
    process.exit(1);
  }
};

export default connectDB;
