"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const eventTypeSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    cover: { type: String, required: true, trim: true },
}, {
    timestamps: true,
    collection: "event_types"
});
const EventType = (0, mongoose_1.model)("EventType", eventTypeSchema);
exports.default = EventType;
