import mongoose, { Document, Schema } from 'mongoose';
import type { IUser } from './user';
import type { IComment } from './comment';
import { commentSchema } from './comment';
import { checklistSchema } from './check-list';
import type { IChecklist } from './check-list';
import type { IPriority } from './priority';
import type { IColumn } from './column';
import type { ILabel } from './label';

export interface ICard extends Document {
  checklists: IChecklist[];
  priority: string | IPriority['_id'];
  comments: IComment[];
  cover: string | null;
  description: string;
  due: number | null;
  isSubscribed: boolean;
  columnId: string | IColumn['_id'];
  memberIds: Array<string | IUser['_id']>;
  labelIds: Array<string | ILabel['_id']>;
  name: string;
}

const cardSchema: Schema<ICard> = new Schema<ICard>({
  checklists: [checklistSchema],
  priority: String,
  comments: [commentSchema],
  cover: String,
  description: String,
  due: Number,
  isSubscribed: Boolean,
  columnId: { type: Schema.Types.ObjectId, ref: 'Column' },
  memberIds: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
  labelIds: [{ type: Schema.Types.ObjectId, ref: 'Label' }],
  name: String,
});

const CardModel = mongoose.model<ICard>('Card', cardSchema);

export default CardModel;
