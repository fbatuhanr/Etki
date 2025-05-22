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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const friendController = __importStar(require("./friend.controller"));
const authMiddleware_1 = __importDefault(require("../../middleware/authMiddleware"));
const router = express_1.default.Router();
router.post("/request/:toUserId", authMiddleware_1.default, friendController.sendFriendRequest);
router.post("/accept-by-user/:fromUserId", authMiddleware_1.default, friendController.acceptFriendRequestByUser);
router.post("/cleanup", authMiddleware_1.default, friendController.cleanUpAcceptedRequests);
router.get("/requests", authMiddleware_1.default, friendController.getIncomingRequests);
router.get("/sent-requests", authMiddleware_1.default, friendController.getSentFriendRequests);
router.get("/friends/:userId", friendController.getFriendsOfUser);
router.get("/is-friend/:userId", authMiddleware_1.default, friendController.checkIsFriend);
router.get("/has-request/:userId", authMiddleware_1.default, friendController.hasPendingRequest);
router.delete("/cancel-by-user/:toUserId", authMiddleware_1.default, friendController.cancelFriendRequestByUser);
router.delete("/reject/:fromUserId", authMiddleware_1.default, friendController.rejectFriendRequestByUser);
router.delete("/:friendId", authMiddleware_1.default, friendController.removeFriend);
exports.default = router;
