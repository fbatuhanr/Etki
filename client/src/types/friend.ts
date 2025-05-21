export type Friend = {
  _id: string;
  username: string;
  name: string;
  surname: string;
  photo?: string;
}

export type IncomingFriendRequestWithUser = {
  _id: string;
  from: {
    _id: string;
    username: string;
    name: string;
    surname: string;
    photo?: string;
  };
  to: string;
  status: "pending" | "accepted";
  createdAt: Date;
  updatedAt: Date;
};

export type SentFriendRequestWithUser = {
  _id: string;
  to: {
    _id: string;
    username: string;
    name: string;
    surname: string;
    photo?: string;
  };
  from: string;
  status: "pending" | "accepted";
  createdAt: Date;
  updatedAt: Date;
};