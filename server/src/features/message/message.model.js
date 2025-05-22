"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    eventId: { type: mongoose_1.Types.ObjectId, ref: "Event", required: true },
    sender: { type: mongoose_1.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Message", messageSchema);
