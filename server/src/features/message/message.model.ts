import { Schema, model, Types } from "mongoose";

const messageSchema = new Schema(
  {
    eventId: { type: Types.ObjectId, ref: "Event", required: true },
    sender: { type: Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default model("Message", messageSchema);
