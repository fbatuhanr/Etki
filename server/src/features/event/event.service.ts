import mongoose, { Types, UpdateQuery } from "mongoose";
import User from "../user/user.model";
import Event from "./event.model";
import EventType from "../event-type/event-type.model";
import { escapeRegex } from "../../utils/regex";

export async function createEvent(data: any, userId: string) {
  const {
    title,
    description,
    type: typeId,
    quota,
    location,
    date,
    isLimitedTime,
    isOnline,
    isPrivate,
    isFree,
    entranceFee,
    cover,
  } = data;

  const type = await EventType.findById(typeId);
  if (!type) {
    throw new Error("Invalid event type.");
  }

  const event = await Event.create({
    title,
    description,
    typeId,
    quota,
    location,
    date,
    isLimitedTime,
    isOnline,
    isPrivate,
    isFree,
    entranceFee,
    cover,
    createdBy: userId,
    participants: [userId],
  });

  return event;
};
export async function updateEvent(id: string, updateData: UpdateQuery<any>) {
  return Event.findByIdAndUpdate(id, updateData, { new: true });
}
export async function deleteEvent(id: string) {
  return Event.findByIdAndDelete(id);
}
export async function attendEvent(eventId: string, userId: string) {
  const event = await Event.findById(eventId).populate("createdBy");
  if (!event) {
    throw new Error("Event not found.");
  }

  if (event.isPrivate) {
    const user = await User.findById(userId).select("friends");
    const isFriend = user?.friends.some((friendId) => friendId.toString() === event?.createdBy!.toString());
    const isOwner = event.createdBy!.toString() === userId;

    if (!isFriend && !isOwner) {
      throw new Error("This event is private. You need to be friends with the creator to join.");
    }
  }

  if (
    event.quota !== undefined &&
    !isNaN(Number(event.quota)) &&
    event.participants.length >= Number(event.quota)
  ) {
    throw new Error("Event is full.");
  }

  const alreadyJoined = event.participants.some((p) => p.toString() === userId);
  if (alreadyJoined) {
    throw new Error("You have already joined this event.");
  }

  event.participants.push(new Types.ObjectId(userId));
  await event.save();
}
export async function leaveEvent(eventId: string, userId: string) {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("Event not found.");
  }
  const userObjectId = new Types.ObjectId(userId);
  const isParticipant = event.participants.some((p) => p.toString() === userId);
  if (!isParticipant) {
    throw new Error("You are not a participant of this event.");
  }
  event.participants.pull(userObjectId);
  await event.save();
}

export async function getAllEvents() {
  const events = await Event.find()
    .populate("typeId")
    .populate("createdBy")
    .populate("participants")
    .sort({ date: 1 })
    .lean();

  return events.map(({ typeId, createdBy, ...rest }) => ({
    ...rest,
    type: typeId,
    creator: createdBy,
  }));
};

export async function getEventById(id: string) {
  const event = await Event.findById(id)
    .populate("typeId")
    .populate("createdBy")
    .populate({
      path: "participants",
      select: "username name surname photo"
    })
    .lean();

  if (!event) return null;

  const { typeId, createdBy, ...rest } = event;
  return {
    ...rest,
    type: typeId,
    creator: createdBy,
  };
};


export async function filterEvents(filters: any[], query?: string) {
  const match: any = {};

  const typeFilter = filters.find(f => f.id === "type");
  if (typeFilter?.value) {
    match.typeId = new mongoose.Types.ObjectId(typeFilter.value as string);
  }

  const dateFilter = filters.find(f => f.id === "date");
  if (dateFilter?.value?.start && dateFilter.value.end) {
    const start = new Date(dateFilter.value.start);
    const end = new Date(dateFilter.value.end);
    if (start.toDateString() === end.toDateString()) {
      end.setHours(23, 59, 59, 999);
    }
    match.date = {
      $gte: start,
      $lte: end,
    };
  }

  if (query) {
    const safeQuery = escapeRegex(query);
    match.$or = [
      { title: { $regex: safeQuery, $options: "i" } },
      { description: { $regex: safeQuery, $options: "i" } },
    ];
  }

  let sort: any = {};
  const sortBy = filters.find(f => f.id === "sortBy")?.value;
  if (sortBy === "newest") {
    sort = { createdAt: -1 };
  } else if (sortBy === "mostPopular") {
    sort = { participantsCount: -1 };
  } else {
    sort = { date: 1 };
  }

  const events = await Event.aggregate([
    { $match: match },
    { $addFields: { participantsCount: { $size: "$participants" } } },
    { $sort: sort },
    {
      $lookup: {
        from: "event_types",
        localField: "typeId",
        foreignField: "_id",
        as: "type",
      },
    },
    { $unwind: "$type" },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "creator",
      },
    },
    { $unwind: "$creator" },
    {
      $lookup: {
        from: "users",
        localField: "participants",
        foreignField: "_id",
        as: "participants",
      },
    },
    {
      $addFields: {
        participants: {
          $map: {
            input: "$participants",
            as: "p",
            in: {
              _id: "$$p._id",
              username: "$$p.username",
              name: "$$p.name",
              surname: "$$p.surname",
              photo: "$$p.photo",
            },
          },
        },
      },
    },

    {
      $project: {
        participantsCount: 0,
        typeId: 0,
        createdBy: 0,
      },
    },
  ]);

  return events;
};


export async function getCreatedEventsByUser(userId: string) {
  return Event.find({ createdBy: userId }).lean();
};
export async function getJoinedEventsByUser(userId: string) {
  return Event.find({ participants: userId }).lean();
};

export async function getFavoriteEventsByUser(userId: string) {
  const user = await User.findById(userId).select("favorites");
  if (!user) throw new Error("User not found.");

  return await Event.find({ _id: { $in: user.favorites } });
}
export async function checkEventIsFavorited(userId: string, eventId: string): Promise<boolean> {
  const user = await User.findById(userId).select("favorites");
  if (!user) throw new Error("User not found.");
  return user.favorites.some((fav) => fav.toString() === eventId);
}
export async function addEventFavorite(userId: string, eventId: string) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found.");
  const alreadyFavorited = user.favorites.some((id) => id.toString() === eventId);
  if (alreadyFavorited) throw new Error("Event already favorited.");
  user.favorites.push(new Types.ObjectId(eventId));
  await user.save();
}
export async function removeEventFavorite(userId: string, eventId: string) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found.");
  user.favorites = user.favorites.filter((fav) => fav.toString() !== eventId);
  await user.save();
}

export async function cancelAttendance(eventId: string, userId: string) {
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");

  event.participants.pull(userId);
  await event.save();
}
