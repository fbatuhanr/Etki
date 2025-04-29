import { Request, Response } from "express";
import {
  createEventService,
  getAllEventsService,
  getEventByIdService,
  getEventTypesService,
} from "./event.service";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const event = await createEventService(req.body);
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create event", error });
  }
};

export const getAllEvents = async (_req: Request, res: Response) => {
  try {
    const events = await getAllEventsService();
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get events", error });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await getEventByIdService(req.params.id);
    if (!event) {
      res.status(404).json({ message: "Event not found." });
      return;
    }
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get event", error });
  }
};

export const getEventTypes = async (_req: Request, res: Response) => {
    console.log("Getting event types");
  try {
    const types = await getEventTypesService();
    res.status(200).json(types);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get event types", error });
  }
};
