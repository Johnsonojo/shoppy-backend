import mongoose, { Document, Schema } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  profilePics?: string;
  isVerified?: boolean;
  role?: string;
  token?: string;
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePics: { type: String, required: false },
    isVerified: { type: Boolean, required: true, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    token: { type: String, required: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<IUserModel>("User", UserSchema);
