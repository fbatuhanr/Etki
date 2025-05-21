export type Message = {
  _id: string;
  eventId: string;
  sender: {
    _id: string;
    name: string;
    surname: string;
    username: string;
    photo?: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type MessageCount = {
  eventId: string;
  count: number;
};