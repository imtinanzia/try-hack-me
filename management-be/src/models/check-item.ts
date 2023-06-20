import mongoose, { Document, Schema } from 'mongoose';

export interface ICheckItem extends Document {
  name: string;
  state: string;
}

export const checkItemSchema: Schema<ICheckItem> = new Schema<ICheckItem>({
  name: String,
  state: String,
});

const CheckItemModel = mongoose.model<ICheckItem>('Checkiten', checkItemSchema);

export default CheckItemModel;
