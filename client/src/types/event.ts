import { MessageCount } from "./message";
import { Participant } from "./participant";

export type Event = {
    _id: string;
    title: string;
    description: string;
    type: {
        _id: string;
        title: string;
        cover: string;
    };
    quota: string;
    location: string;
    date: Date;
    isLimitedTime: boolean;
    isOnline: boolean;
    isPrivate: boolean;
    isFree: boolean;
    entranceFee: string;
    cover: string;
    participants: Participant[];
    creator: {
        _id: string;
        username: string;
        name: string;
        surname: string;
        photo?: string;
    }
    createdAt: Date;
    updatedAt: Date;
};

export type EventCard = Pick<
    Event,
    | "_id"
    | "title"
    | "quota"
    | "location"
    | "date"
    | "isLimitedTime"
    | "isOnline"
    | "isPrivate"
    | "isFree"
    | "cover"
    | "participants"
    | "type"
>;

export type EventCardHistory = Pick<Event, "_id" | "title" | "cover" | "date">;

export type EventChat = {
    _id: string;
    title: string;
    eventId: string;
    cover: string;
    date: Date;
} & MessageCount;