import Event from "./event.model";
import EventType from "./event_type.model";

export const createEventService = async (data: any) => {
  const {
    title,
    description,
    typeId,
    date,
    location,
    isOnline,
    isPrivate,
    isFree,
    entranceFee,
    offerExpirationDate,
    createdBy,
  } = data;

  const type = await EventType.findById(typeId);
  if (!type) {
    throw new Error("Invalid event type.");
  }

  const event = await Event.create({
    title,
    description,
    typeId,
    date,
    location,
    isOnline,
    isPrivate,
    isFree,
    entranceFee,
    offerExpirationDate,
    createdBy,
  });

  return event;
};

export const getAllEventsService = async () => {
  const events = await Event.find()
    .populate("typeId")
    .populate("createdBy")
    .sort({ date: 1 });

  return events;
};

export const getEventByIdService = async (id: string) => {
  const event = await Event.findById(id)
    .populate("typeId")
    .populate("createdBy");

  return event;
};

export const getEventTypesService = async () => {
  const types = await EventType.find().sort({ title: 1 });
  return types;
};
