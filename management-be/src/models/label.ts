import mongoose, { Document, Schema } from 'mongoose';

export interface ILabel extends Document {
  name: string;
}

const labelSchema: Schema<ILabel> = new Schema<ILabel>({
  name: String,
});

const LabelModel = mongoose.model<ILabel>('Label', labelSchema);

export default LabelModel;
