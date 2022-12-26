import { Document, Model, model, Schema } from 'mongoose';

export interface UserDoc extends Document {
  googleId: string;
  username: string;
}

interface UserModel extends Model<UserDoc> {
  googleId: string;
  username: string;
}

const userSchema = new Schema({
  googleId: { type: String, required: true },
  username: { type: String, required: true },
});

const User = model<UserDoc, UserModel>('user', userSchema);

export { User };
