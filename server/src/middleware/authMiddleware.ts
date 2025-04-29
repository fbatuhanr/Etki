import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { DecodedUserProps } from "../types/User.types";

export interface CustomRequest extends Request {
  user?: DecodedUserProps;
}

const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access token is missing" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as DecodedUserProps;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired access token" });
  }
}

export default authenticateToken;