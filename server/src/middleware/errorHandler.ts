import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { MongoError } from "mongodb";
import { Error as MongooseError } from "mongoose";

type CustomError = MongoError | MongooseError.ValidationError | MongooseError.CastError | Error;

const errorHandler: ErrorRequestHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {

  console.error(err.stack);

  // Duplicate key error
  if (err instanceof MongoError && err.code === 11000) {
    res.status(409).json({ message: "Duplicate key error: A record with this information already exists." });
    return;
  }

  // Mongoose validation error
  if (err instanceof MongooseError.ValidationError) {
    const messages = Object.values(err.errors).map((error) => error.message);
    res.status(400).json({ message: `Validation Error: ${messages.join(", ")}` });
    return;
  }

  // Mongoose cast error
  if (err instanceof MongooseError.CastError) {
    res.status(400).json({ message: `Invalid ${err.path}: ${err.value}.` });
    return;
  }

  // General server error
  res.status(500).json({ message: `(?) ${err.message}` || "(?) Internal Server Error" });
}

export default errorHandler;