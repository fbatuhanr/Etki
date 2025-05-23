import mongoose, { Schema, model, InferSchemaType } from 'mongoose';
import bcrypt from "bcryptjs"

const UserSchema = new Schema({
    username: { type: String, unique: true, index: true, required: true, trim: true },
    email: { type: String, unique: true, index: true, required: true, trim: true },
    hashPassword: { type: String, required: true },
    name: { type: String, required: true },
    surname:{ type: String, required: true },
    photo: { type: String },
    biography: { type: String },
    isPublic: { type: Boolean, default: true },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }]
  },
  {
    timestamps: true
  }
)

UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compareSync(password, this.hashPassword)
}

export declare interface IUser extends InferSchemaType<typeof UserSchema> {
  comparePassword(password: string): boolean
}

export default model<IUser>("User", UserSchema)