import express from "express";
import * as friendController from "./friend.controller";
import authenticateToken from "../../middleware/authMiddleware";

const router = express.Router();

router.post("/request/:toUserId", authenticateToken, friendController.sendFriendRequest);
router.post("/accept-by-user/:fromUserId", authenticateToken, friendController.acceptFriendRequestByUser);

router.get("/requests", authenticateToken, friendController.getIncomingRequests);
router.get("/friends/:userId", friendController.getFriendsOfUser);
router.get("/is-friend/:userId", authenticateToken, friendController.checkIsFriend);
router.get("/has-request/:userId", authenticateToken,friendController.hasPendingRequest);

router.delete("/cancel-by-user/:toUserId", authenticateToken, friendController.cancelFriendRequestByUser);
router.delete("/reject/:fromUserId", authenticateToken, friendController.rejectFriendRequestByUser);
router.delete("/:friendId", authenticateToken, friendController.removeFriend);

export default router;
