import User from "./user.model";
import FriendRequest from "../friend/friend.model";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../auth/auth.service";
import { Types } from "mongoose";

type UserProps = { username: string; password: string; email: string | null };

export async function login(data: UserProps) {
  const { username, password } = data;

  const user = await User.findOne({ username });
  if (!user) return false;
  if (!user.comparePassword(password)) return false;

  const accessToken = generateAccessToken({
    userId: user._id,
    username: user.username,
  });
  const refreshToken = generateRefreshToken({
    userId: user._id,
    username: user.username,
  });
  return { accessToken, refreshToken };
}
export async function logout() { return; }
export async function signup(data: UserProps) {
  const newUser = new User(data);
  newUser.hashPassword = bcrypt.hashSync(data.password, 10);

  const savedUser = await newUser.save();

  /* admin automatically adds friends for each new user  */
  /* const adminUser = await User.findOne({ username: "admin" });
  if (adminUser) {
    const newFriendRequest = new FriendRequest({
      sender: savedUser._id,
      receiver: adminUser._id,
      status: "accepted",
    });
    await newFriendRequest.save();

    await User.updateOne(
      { _id: adminUser._id },
      { $addToSet: { friends: savedUser._id } }
    );
    await User.updateOne(
      { _id: savedUser._id },
      { $addToSet: { friends: adminUser._id } }
    );
  }
  */

  return savedUser ? true : false;
}

export async function searchUsers(query: string, currentUserId: string) {
  const regex = new RegExp(query, "i");

  const currentUser = await User.findById(currentUserId).select("friends");
  const friendIds = currentUser?.friends.map(id => id.toString()) || [];

  const incomingRequests = await FriendRequest.find({
    to: currentUserId,
    status: "pending",
  }).select("from");
  const incomingRequestIds = incomingRequests.map(req => req.from.toString());

  const excludeIds = [
    currentUserId,
    ...friendIds,
    ...incomingRequestIds
  ];

  const users = await User.find({
    $or: [
      { username: regex },
      { name: regex },
      { surname: regex },
    ],
    _id: { $nin: excludeIds }
  }).select("_id username name surname photo");

  const outgoingRequests = await FriendRequest.find({
    from: currentUserId,
    status: "pending",
    to: { $in: users.map(u => u._id) }
  }).select("to");

  const outgoingMap = new Set(outgoingRequests.map(req => req.to.toString()));

  return users.map((user) => ({
    _id: user._id.toString(),
    username: user.username,
    name: user.name,
    surname: user.surname,
    photo: user.photo,
    hasPendingRequest: outgoingMap.has(user._id.toString())
  }));
}


export async function get(id: string) {
  return User.findById(id);
}
export async function update(id: string, data: UserProps) {
  return User.findOneAndUpdate({ _id: id }, data);
}