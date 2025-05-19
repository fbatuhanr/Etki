import { Request } from "express";
import { DecodedUserProps } from "../types/user";

export interface CustomRequest extends Request {
  user?: DecodedUserProps;
}