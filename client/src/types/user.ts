import { Event } from "./event";
import { Friend } from "./friend";

export type User = {
  _id: string;
  username: string;
  email: string;
  name: string;
  surname: string;
  photo?: string;
  biography?: string;
  isPublic: boolean;
  friends: Friend[];
  favorites: Event[];
  createdAt: string;
  updatedAt: string;
};

export type UserSearch = {
  _id: string;
  username: string;
  name: string;
  surname: string;
  photo?: string;
  hasPendingRequest: boolean;
};