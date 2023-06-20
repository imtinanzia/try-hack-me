import mongoose, { Document, Schema } from 'mongoose';

export interface IPriority extends Document {
  name: string;
}

const prioritySchema: Schema<IPriority> = new Schema<IPriority>({
  name: String,
});

const PriorityModel = mongoose.model<IPriority>('Priority', prioritySchema);
export default PriorityModel;
