"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const eventSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    typeId: { type: mongoose_1.Types.ObjectId, ref: "EventType", required: true },
    quota: { type: String },
    location: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    isLimitedTime: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    isPrivate: { type: Boolean, default: false },
    isFree: { type: Boolean, default: true },
    entranceFee: { type: String, default: "" },
    cover: { type: String },
    participants: [{ type: mongoose_1.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose_1.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });
const Event = (0, mongoose_1.model)("Event", eventSchema);
exports.default = Event;
