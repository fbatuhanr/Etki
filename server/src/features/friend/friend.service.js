"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFriendRequest = sendFriendRequest;
exports.cancelFriendRequestByUser = cancelFriendRequestByUser;
exports.acceptFriendRequestByUser = acceptFriendRequestByUser;
exports.rejectFriendRequestByUser = rejectFriendRequestByUser;
exports.getIncomingRequests = getIncomingRequests;
exports.getSentFriendRequests = getSentFriendRequests;
exports.getFriendsOfUser = getFriendsOfUser;
exports.checkIsFriend = checkIsFriend;
exports.hasPendingRequest = hasPendingRequest;
exports.removeFriend = removeFriend;
exports.cleanUpAcceptedRequests = cleanUpAcceptedRequests;
const friend_model_1 = __importDefault(require("./friend.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
function sendFriendRequest(fromUserId, toUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fromUserId === toUserId)
            throw new Error("Cannot send request to yourself.");
        const existing = yield friend_model_1.default.findOne({
            from: fromUserId,
            to: toUserId,
            status: "pending",
        });
        if (existing)
            throw new Error("Friend request already sent.");
        yield friend_model_1.default.create({ from: fromUserId, to: toUserId });
        return "Friend request sent.";
    });
}
function cancelFriendRequestByUser(fromUserId, toUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        const request = yield friend_model_1.default.findOne({
            from: fromUserId,
            to: toUserId,
        });
        if (!request) {
            throw new Error("No friend request found.");
        }
        if (request.status !== "pending") {
            throw new Error("This request has already been accepted or rejected.");
        }
        yield request.deleteOne();
        return "Friend request canceled.";
    });
}
function acceptFriendRequestByUser(fromUserId, toUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        const request = yield friend_model_1.default.findOne({
            from: fromUserId,
            to: toUserId,
            status: "pending"
        });
        if (!request) {
            throw new Error("No pending friend request to accept.");
        }
        request.status = "accepted";
        yield request.save();
        yield user_model_1.default.findByIdAndUpdate(toUserId, { $addToSet: { friends: fromUserId } });
        yield user_model_1.default.findByIdAndUpdate(fromUserId, { $addToSet: { friends: toUserId } });
        return "Friend request accepted.";
    });
}
function rejectFriendRequestByUser(fromUserId, toUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        const deleted = yield friend_model_1.default.findOneAndDelete({
            from: fromUserId,
            to: toUserId,
            status: "pending"
        });
        if (!deleted) {
            throw new Error("No pending friend request to reject.");
        }
        return "Friend request rejected.";
    });
}
function getIncomingRequests(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield friend_model_1.default.find({ to: userId, status: "pending" })
            .populate("from", "username name surname photo")
            .sort({ createdAt: -1 });
    });
}
function getSentFriendRequests(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield friend_model_1.default.find({ from: userId, status: "pending" })
            .populate("to", "username name surname photo")
            .sort({ createdAt: -1 });
    });
}
function getFriendsOfUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.default.findById(userId).populate("friends", "username name surname photo");
        if (!user)
            throw new Error("User not found.");
        return user.friends;
    });
}
function checkIsFriend(currentUserId, otherUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (currentUserId === otherUserId)
            return false;
        const result = yield user_model_1.default.exists({
            _id: currentUserId,
            friends: otherUserId,
        });
        return !!result;
    });
}
function hasPendingRequest(fromUserId, toUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (fromUserId === toUserId)
            return false;
        const result = yield friend_model_1.default.exists({
            from: fromUserId,
            to: toUserId,
            status: "pending",
        });
        return !!result;
    });
}
function removeFriend(userId, friendId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (userId === friendId)
            throw new Error("Cannot unfriend yourself.");
        const user = yield user_model_1.default.findById(userId);
        const friend = yield user_model_1.default.findById(friendId);
        if (!user || !friend)
            throw new Error("User not found.");
        yield user_model_1.default.findByIdAndUpdate(userId, {
            $pull: { friends: friendId }
        });
        yield user_model_1.default.findByIdAndUpdate(friendId, {
            $pull: { friends: userId }
        });
        return "Friend removed successfully.";
    });
}
function cleanUpAcceptedRequests(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const acceptedRequests = yield friend_model_1.default.find({
            status: "accepted",
            $or: [{ from: userId }, { to: userId }]
        });
        for (const request of acceptedRequests) {
            const fromIsFriend = yield checkIsFriend(request.from.toString(), request.to.toString());
            if (!fromIsFriend) {
                yield request.deleteOne();
            }
        }
    });
}
