import { Schema, model, Types } from "mongoose";

const friendRequestSchema = new Schema(
  {
    from: { type: Types.ObjectId, ref: "User", required: true },
    to: { type: Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default model("FriendRequest", friendRequestSchema);
