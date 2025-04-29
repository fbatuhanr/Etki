import { Schema, model } from "mongoose";

const eventTypeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    cover: {
      type: String,
      required: true,
      trim: true,
    },
  },
);

const EventType = model("event_types", eventTypeSchema);

export default EventType;
