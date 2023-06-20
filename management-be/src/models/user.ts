import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the document
interface IUser extends Document {
  email: string;
  name: string;
  password: string;
}

// Define the schema
const userSchema: Schema<IUser> = new Schema<IUser>({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
});

// Create and export the model
const UserModel = mongoose.model<IUser>('User', userSchema);
export default UserModel;

export type { IUser };
