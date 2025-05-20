import { Schema, model, Types } from "mongoose";
const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    typeId: { type: Types.ObjectId, ref: "EventType", required: true },
    quota: { type: String },
    location: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    isLimitedTime: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    isPrivate: { type: Boolean, default: false },
    isFree: { type: Boolean, default: true },
    entranceFee: { type: String, default: "" },
    cover: { type: String },
    participants: [{ type: Types.ObjectId, ref: "User" }],
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Event = model("Event", eventSchema);

export default Event;
