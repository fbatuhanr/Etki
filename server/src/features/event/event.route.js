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
const express_1 = require("express");
const eventController = __importStar(require("./event.controller"));
const authMiddleware_1 = __importDefault(require("../../middleware/authMiddleware"));
const router = (0, express_1.Router)();
// Event CRUD
router.post("/", authMiddleware_1.default, eventController.createEvent);
router.post("/:eventId/attend", authMiddleware_1.default, eventController.attendEvent);
router.post("/:eventId/leave", authMiddleware_1.default, eventController.leaveEvent);
router.get("/:eventId/is-favorited", authMiddleware_1.default, eventController.checkEventIsFavorited);
router.post("/:eventId/favorite", authMiddleware_1.default, eventController.addEventFavorite);
router.delete("/:eventId/favorite", authMiddleware_1.default, eventController.removeEventFavorite);
router.get("/favorites/:userId", authMiddleware_1.default, eventController.getFavoriteEventsByUser);
router.get("/", eventController.getAllEvents);
router.get("/filter", eventController.filterEvents);
router.get('/created/:userId', eventController.getCreatedEvents);
router.get('/joined/:userId', eventController.getJoinedEvents);
router.get("/:id", eventController.getEventById);
router.put("/:id", authMiddleware_1.default, eventController.updateEvent);
router.delete("/:id", authMiddleware_1.default, eventController.deleteEvent);
router.delete("/:eventId/attendance/:userId", authMiddleware_1.default, eventController.cancelAttendance);
exports.default = router;
