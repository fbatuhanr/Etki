import FriendRequest from "./friend.model";
import User from "../user/user.model";

export async function sendFriendRequest(fromUserId: string, toUserId: string) {
  if (fromUserId === toUserId) throw new Error("Cannot send request to yourself.");

  const existing = await FriendRequest.findOne({
    from: fromUserId,
    to: toUserId,
    status: "pending",
  });

  if (existing) throw new Error("Friend request already sent.");

  await FriendRequest.create({ from: fromUserId, to: toUserId });
  return "Friend request sent.";
}

export async function cancelFriendRequestByUser(fromUserId: string, toUserId: string) {
  const request = await FriendRequest.findOneAndDelete({
    from: fromUserId,
    to: toUserId,
    status: "pending"
  });

  if (!request) {
    throw new Error("No pending friend request found to cancel.");
  }

  return "Friend request canceled.";
}

export async function acceptFriendRequestByUser(fromUserId: string, toUserId: string) {
  const request = await FriendRequest.findOne({
    from: fromUserId,
    to: toUserId,
    status: "pending"
  });

  if (!request) {
    throw new Error("No pending friend request to accept.");
  }

  request.status = "accepted";
  await request.save();

  await User.findByIdAndUpdate(toUserId, { $addToSet: { friends: fromUserId } });
  await User.findByIdAndUpdate(fromUserId, { $addToSet: { friends: toUserId } });

  return "Friend request accepted.";
}

export async function rejectFriendRequestByUser(fromUserId: string, toUserId: string) {
  const deleted = await FriendRequest.findOneAndDelete({
    from: fromUserId,
    to: toUserId,
    status: "pending"
  });

  if (!deleted) {
    throw new Error("No pending friend request to reject.");
  }

  return "Friend request rejected.";
}

export async function getIncomingRequests(userId: string) {
  return await FriendRequest.find({ to: userId, status: "pending" })
    .populate("from", "username name surname photo")
    .sort({ createdAt: -1 });
}
export async function getSentFriendRequests(userId: string) {
  return await FriendRequest.find({ from: userId })
    .populate("to", "username name surname photo")
    .sort({ createdAt: -1 });
};

export async function getFriendsOfUser(userId: string) {
  const user = await User.findById(userId).populate("friends", "username name surname photo");
  if (!user) throw new Error("User not found.");
  return user.friends;
}

export async function checkIsFriend(currentUserId: string, otherUserId: string): Promise<boolean> {
  if (currentUserId === otherUserId) return false;

  const result = await User.exists({
    _id: currentUserId,
    friends: otherUserId,
  });

  return !!result;
}

export async function hasPendingRequest(fromUserId: string, toUserId: string): Promise<boolean> {
  if (fromUserId === toUserId) return false;

  const result = await FriendRequest.exists({
    from: fromUserId,
    to: toUserId,
    status: "pending",
  });

  return !!result;
}

export async function removeFriend(userId: string, friendId: string) {
  if (userId === friendId) throw new Error("Cannot unfriend yourself.");

  const user = await User.findById(userId);
  const friend = await User.findById(friendId);

  if (!user || !friend) throw new Error("User not found.");
  await User.findByIdAndUpdate(userId, {
    $pull: { friends: friendId }
  });

  await User.findByIdAndUpdate(friendId, {
    $pull: { friends: userId }
  });

  return "Friend removed successfully.";
}
