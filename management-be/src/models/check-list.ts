import mongoose, { Document, Schema } from 'mongoose';
import type { ICheckItem } from './check-item';
import { checkItemSchema } from './check-item';

export interface IChecklist extends Document {
  name: string;
  checkItems: ICheckItem[];
}

export const checklistSchema: Schema<IChecklist> = new Schema<IChecklist>({
  name: String,
  checkItems: [checkItemSchema],
});

const CheckListModel = mongoose.model<IChecklist>('Checlist', checklistSchema);

export default CheckListModel;
