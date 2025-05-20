export type Friend = {
  _id: string;
  username: string;
  name: string;
  surname: string;
  photo?: string;
}

export type FriendRequestWithUser = {
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