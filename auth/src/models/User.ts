import { Document, model, Schema } from 'mongoose';

export interface UserDoc extends Document {
  googleId: string;
  username: string;
}

const userSchema = new Schema<UserDoc>({
  googleId: { type: String, required: true },
  username: { type: String, required: true },
});

const User = model<UserDoc>('user', userSchema);

export { User };
