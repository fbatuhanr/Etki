"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = sendMessage;
exports.getMessagesByEventId = getMessagesByEventId;
exports.getMessageCountsByEventIds = getMessageCountsByEventIds;
const mongoose_1 = __importDefault(require("mongoose"));
const message_model_1 = __importDefault(require("./message.model"));
function sendMessage(eventId, senderId, content) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield message_model_1.default.create({ eventId, sender: senderId, content });
    });
}
function getMessagesByEventId(eventId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield message_model_1.default.find({ eventId })
            .populate("sender", "username name surname photo")
            .sort({ createdAt: 1 });
    });
}
function getMessageCountsByEventIds(eventIds) {
    return __awaiter(this, void 0, void 0, function* () {
        const counts = yield message_model_1.default.aggregate([
            { $match: { eventId: { $in: eventIds.map(id => new mongoose_1.default.Types.ObjectId(id)) } } },
            { $group: { _id: "$eventId", count: { $sum: 1 } } },
        ]);
        return counts.map((c) => ({ eventId: c._id.toString(), count: c.count }));
    });
}
