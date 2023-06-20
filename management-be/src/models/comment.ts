import mongoose, { Document, Schema } from 'mongoose';
import type { IUser } from './user';
import type { ICard } from './card';

export interface IComment extends Document {
  cardId: string | ICard['_id'];
  memberId: string | IUser['_id'];
  message: string;
  replies: any[];
}

export const commentSchema: Schema<IComment> = new Schema<IComment>({
  cardId: { type: Schema.Types.ObjectId, ref: 'Card' },
  memberId: { type: Schema.Types.ObjectId, ref: 'Member' },
  message: String,
  replies: [Schema.Types.Mixed],
});
const CommentModel = mongoose.model<IComment>('Comment', commentSchema);

export default CommentModel;
