import EventType from "./event-type.model";

export async function getEventTypes() {
  return EventType.find().sort({ title: 1 });
};