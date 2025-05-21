import mongoose from "mongoose";
import Message from "./message.model";

export async function sendMessage(eventId: string, senderId: string, content: string) {
  return await Message.create({ eventId, sender: senderId, content });
}

export async function getMessagesByEventId(eventId: string) {
  return await Message.find({ eventId })
    .populate("sender", "username name surname photo")
    .sort({ createdAt: 1 });
}

export async function getMessageCountsByEventIds(eventIds: string[]) {
  const counts = await Message.aggregate([
    { $match: { eventId: { $in: eventIds.map(id => new mongoose.Types.ObjectId(id)) } } },
    { $group: { _id: "$eventId", count: { $sum: 1 } } },
  ]);

  return counts.map((c) => ({ eventId: c._id.toString(), count: c.count }));
}