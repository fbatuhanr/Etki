import { NextFunction, Request, Response } from "express";
import * as eventTypeService from "./event-type.service";

export async function getEventTypes(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const types = await eventTypeService.getEventTypes();
    res.status(200).json({ message: "Event types fetched successfully", data: types });
  } catch (error) {
    next(error);
  }
};