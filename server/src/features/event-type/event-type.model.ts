import { Schema, model } from "mongoose";

const eventTypeSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    cover: { type: String, required: true, trim: true },
  },
  { 
    timestamps: true,
    collection: "event_types"
  },
  
);

const EventType = model("EventType", eventTypeSchema);
export default EventType;