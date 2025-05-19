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
        fullName: string;
        email?: string;
        avatar?: string;
    };
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
