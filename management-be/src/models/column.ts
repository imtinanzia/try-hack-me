import mongoose, { Document, Schema } from 'mongoose';
import type { ICard } from './card';

export interface IColumn extends Document {
  name: string;
  cardIds: Array<string | ICard['_id']>;
}

const columnSchema: Schema<IColumn> = new Schema<IColumn>({
  name: String,
  cardIds: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
});

const ColumnModel = mongoose.model<IColumn>('Column', columnSchema);

export default ColumnModel;
