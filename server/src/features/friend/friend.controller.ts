import { Request, Response, NextFunction } from "express";
import * as friendService from "./friend.service";
import { CustomRequest } from "../../types/request";

export async function sendFriendRequest(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const fromUserId = req.user!.userId;
    const toUserId = req.params.toUserId;

    const result = await friendService.sendFriendRequest(fromUserId, toUserId);
    res.status(201).json({ message: result });
  } catch (err) {
    next(err);
  }
}
export async function cancelFriendRequestByUser(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const fromUserId = req.user!.userId;
    const toUserId = req.params.toUserId;

    const message = await friendService.cancelFriendRequestByUser(fromUserId, toUserId);
    res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
}

export async function acceptFriendRequestByUser(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const toUserId = req.user!.userId;
    const fromUserId = req.params.fromUserId;

    const message = await friendService.acceptFriendRequestByUser(fromUserId, toUserId);
    res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
}

export async function rejectFriendRequestByUser(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const toUserId = req.user!.userId;
    const fromUserId = req.params.fromUserId;

    const message = await friendService.rejectFriendRequestByUser(fromUserId, toUserId);
    res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
}


export async function getIncomingRequests(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req.user!;

    const requests = await friendService.getIncomingRequests(userId);
    res.status(200).json({ data: requests });
  } catch (err) {
    next(err);
  }
}
export const getSentFriendRequests = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user!;
    const sentRequests = await friendService.getSentFriendRequests(userId);
    res.status(200).json({ data: sentRequests });
  } catch (err) {
    next(err);
  }
};

export async function getFriendsOfUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.params.userId;
    const friends = await friendService.getFriendsOfUser(userId);
    res.status(200).json({ data: friends });
  } catch (err) {
    next(err);
  }
}

export async function checkIsFriend(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const currentUserId = req.user!.userId;
    const otherUserId = req.params.userId;

    const isFriend = await friendService.checkIsFriend(currentUserId, otherUserId);
    res.status(200).json({ isFriend });
  } catch (err) {
    next(err);
  }
}

export async function hasPendingRequest(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const fromUserId = req.user!.userId;
    const toUserId = req.params.userId;

    const result = await friendService.hasPendingRequest(fromUserId, toUserId);
    res.status(200).json({ hasPendingRequest: result });
  } catch (err) {
    next(err);
  }
}



export async function removeFriend(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const { userId } = req.user!;
    const friendId = req.params.friendId;

    const message = await friendService.removeFriend(userId, friendId);
    res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
}
