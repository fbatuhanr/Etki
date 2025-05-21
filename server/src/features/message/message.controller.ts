import { Request, Response, NextFunction } from "express";
import * as messageService from "./message.service";
import { CustomRequest } from "../../types/request";

export async function sendMessage(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const { eventId } = req.params;
    const { content } = req.body;
    const senderId = req.user!.userId;

    const message = await messageService.sendMessage(eventId, senderId, content);
    res.status(201).json({ data: message });
  } catch (err) {
    next(err);
  }
}

export async function getMessagesByEventId(req: Request, res: Response, next: NextFunction) {
  try {
    const { eventId } = req.params;
    const messages = await messageService.getMessagesByEventId(eventId);
    res.status(200).json({ data: messages });
  } catch (err) {
    next(err);
  }
}

export async function getMessageCountsByEventIds(req: Request, res: Response, next: NextFunction) {
  try {
    const { eventIds } = req.body;
    if (!Array.isArray(eventIds)) {
      res.status(400).json({ message: "eventIds must be an array." });
      return;
    }

    const counts = await messageService.getMessageCountsByEventIds(eventIds);
    res.status(200).json({ data: counts });
  } catch (err) {
    next(err);
  }
}