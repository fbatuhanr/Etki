"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const friendRequestSchema = new mongoose_1.Schema({
    from: { type: mongoose_1.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose_1.Types.ObjectId, ref: "User", required: true },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("FriendRequest", friendRequestSchema);
