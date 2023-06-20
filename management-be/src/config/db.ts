import mongoose from 'mongoose';
import colors from 'colors';

//  * CONNECT DATA BASE
const connectDB = async () => {
  const { cyan } = colors;
  const conn = await mongoose.connect(process.env.MONGO_URI as string);
  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};

export default connectDB;
