"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSentFriendRequests = void 0;
exports.sendFriendRequest = sendFriendRequest;
exports.cancelFriendRequestByUser = cancelFriendRequestByUser;
exports.acceptFriendRequestByUser = acceptFriendRequestByUser;
exports.rejectFriendRequestByUser = rejectFriendRequestByUser;
exports.getIncomingRequests = getIncomingRequests;
exports.getFriendsOfUser = getFriendsOfUser;
exports.checkIsFriend = checkIsFriend;
exports.hasPendingRequest = hasPendingRequest;
exports.removeFriend = removeFriend;
exports.cleanUpAcceptedRequests = cleanUpAcceptedRequests;
const friendService = __importStar(require("./friend.service"));
function sendFriendRequest(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fromUserId = req.user.userId;
            const toUserId = req.params.toUserId;
            const result = yield friendService.sendFriendRequest(fromUserId, toUserId);
            res.status(201).json({ message: result });
        }
        catch (err) {
            next(err);
        }
    });
}
function cancelFriendRequestByUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fromUserId = req.user.userId;
            const toUserId = req.params.toUserId;
            const message = yield friendService.cancelFriendRequestByUser(fromUserId, toUserId);
            res.status(200).json({ message });
        }
        catch (err) {
            next(err);
        }
    });
}
function acceptFriendRequestByUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const toUserId = req.user.userId;
            const fromUserId = req.params.fromUserId;
            const message = yield friendService.acceptFriendRequestByUser(fromUserId, toUserId);
            res.status(200).json({ message });
        }
        catch (err) {
            next(err);
        }
    });
}
function rejectFriendRequestByUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const toUserId = req.user.userId;
            const fromUserId = req.params.fromUserId;
            const message = yield friendService.rejectFriendRequestByUser(fromUserId, toUserId);
            res.status(200).json({ message });
        }
        catch (err) {
            next(err);
        }
    });
}
function getIncomingRequests(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.user;
            const requests = yield friendService.getIncomingRequests(userId);
            res.status(200).json({ data: requests });
        }
        catch (err) {
            next(err);
        }
    });
}
const getSentFriendRequests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const sentRequests = yield friendService.getSentFriendRequests(userId);
        res.status(200).json({ data: sentRequests });
    }
    catch (err) {
        next(err);
    }
});
exports.getSentFriendRequests = getSentFriendRequests;
function getFriendsOfUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.params.userId;
            const friends = yield friendService.getFriendsOfUser(userId);
            res.status(200).json({ data: friends });
        }
        catch (err) {
            next(err);
        }
    });
}
function checkIsFriend(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const currentUserId = req.user.userId;
            const otherUserId = req.params.userId;
            const isFriend = yield friendService.checkIsFriend(currentUserId, otherUserId);
            res.status(200).json({ isFriend });
        }
        catch (err) {
            next(err);
        }
    });
}
function hasPendingRequest(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fromUserId = req.user.userId;
            const toUserId = req.params.userId;
            const result = yield friendService.hasPendingRequest(fromUserId, toUserId);
            res.status(200).json({ hasPendingRequest: result });
        }
        catch (err) {
            next(err);
        }
    });
}
function removeFriend(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.user;
            const friendId = req.params.friendId;
            const message = yield friendService.removeFriend(userId, friendId);
            res.status(200).json({ message });
        }
        catch (err) {
            next(err);
        }
    });
}
function cleanUpAcceptedRequests(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.user;
            const result = yield friendService.cleanUpAcceptedRequests(userId);
            res.status(200).json({ message: "Cleanup complete", removedCount: result });
        }
        catch (err) {
            next(err);
        }
    });
}
