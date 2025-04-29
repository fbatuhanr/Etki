import { Schema, model, Types } from "mongoose";

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    typeId: {
      type: Types.ObjectId,
      ref: "event_types",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    isFree: {
      type: Boolean,
      default: true,
    },
    entranceFee: {
      type: String,
      default: "",
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "users",
      required: true,
    },
    participants: [
      {
        type: Types.ObjectId,
        ref: "users",
      },
    ],
    offerExpirationDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Event = model("events", eventSchema);

export default Event;
