import { NextFunction, Request, Response } from "express";
import * as eventService from "./event.service";
import { CustomRequest } from "../../types/request";

export async function createEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = (req as any).user;
    const event = await eventService.createEvent(req.body, userId);
    res.status(201).json({ message: "Event created successfully", data: event });
  } catch (error) {
    next(error);
  }
};
export async function updateEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const updatedEvent = await eventService.updateEvent(id, req.body);
    res.status(200).json({ message: "Event updated successfully", data: updatedEvent });
  } catch (error) {
    next(error);
  }
}
export async function deleteEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const deleted = await eventService.deleteEvent(id);
    res.status(200).json({ message: "Event deleted successfully", data: deleted });
  } catch (error) {
    next(error);
  }
}

export async function attendEvent(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req.user!;
    const eventId = req.params.eventId;
    await eventService.attendEvent(eventId, userId);
    res.status(200).json({ message: "Successfully joined the event" });
  } catch (err) {
    next(err);
  }
};
export async function leaveEvent(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req.user!;
    const eventId = req.params.eventId;
    await eventService.leaveEvent(eventId, userId);
    res.status(200).json({ message: "Successfully left the event" });
  } catch (err) {
    next(err);
  }
}

export async function getAllEvents(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const events = await eventService.getAllEvents();
    res.status(200).json({ message: "Events fetched successfully", data: events });
  } catch (error) {
    next(error);
  }
};

export async function getEventById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const event = await eventService.getEventById(req.params.id);
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.status(200).json({ message: "Event fetched successfully", data: event });
  } catch (error) {
    next(error);
  }
};

export async function filterEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { filters, query } = req.query;
    const parsedFilters = typeof filters === 'string' ? JSON.parse(decodeURIComponent(filters)) : filters;

    const events = await eventService.filterEvents(parsedFilters, query as string);
    res.status(200).json({ message: "Events filtered successfully", data: events });
  } catch (error) {
    next(error);
  }
};

export async function getCreatedEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = req.params;
    const events = await eventService.getCreatedEventsByUser(userId);
    res.status(200).json({ message: "Created events fetched successfully", data: events });
  } catch (error) {
    next(error);
  }
}
export async function getJoinedEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { userId } = req.params;
    const events = await eventService.getJoinedEventsByUser(userId);
    res.status(200).json({ message: "Joined events fetched successfully", data: events });
  } catch (error) {
    next(error);
  }
}

export async function getFavoriteEventsByUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    const events = await eventService.getFavoriteEventsByUser(userId as string);
    res.status(200).json({ data: events });
  } catch (err) {
    next(err);
  }
}
export async function checkEventIsFavorited(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req.user!;
    const eventId = req.params.eventId;
    const isFavorited = await eventService.checkEventIsFavorited(userId, eventId);
    res.status(200).json({ isFavorited });
  } catch (err) {
    next(err);
  }
}
export async function addEventFavorite(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req.user!;
    const eventId = req.params.eventId;
    await eventService.addEventFavorite(userId, eventId);
    res.status(200).json({ message: "Added to favorites" });
  } catch (err) {
    next(err);
  }
}
export async function removeEventFavorite(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const eventId = req.params.eventId;
    await eventService.removeEventFavorite(userId, eventId);
    res.status(200).json({ message: "Removed from favorites" });
  } catch (err) {
    next(err);
  }
}
export async function cancelAttendance(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { eventId, userId } = req.params;
    await eventService.cancelAttendance(eventId, userId);
    res.status(200).json({ message: "Attendance cancelled." });
  } catch (err) {
    next(err);
  }
}
