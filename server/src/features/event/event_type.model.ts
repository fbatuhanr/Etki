import { Schema, model } from "mongoose";

const eventTypeSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    cover: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const EventType = model("EventTypes", eventTypeSchema);
export default EventType;