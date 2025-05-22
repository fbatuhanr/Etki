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
exports.createEvent = createEvent;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;
exports.attendEvent = attendEvent;
exports.leaveEvent = leaveEvent;
exports.getAllEvents = getAllEvents;
exports.getEventById = getEventById;
exports.filterEvents = filterEvents;
exports.getCreatedEvents = getCreatedEvents;
exports.getJoinedEvents = getJoinedEvents;
exports.getFavoriteEventsByUser = getFavoriteEventsByUser;
exports.checkEventIsFavorited = checkEventIsFavorited;
exports.addEventFavorite = addEventFavorite;
exports.removeEventFavorite = removeEventFavorite;
exports.cancelAttendance = cancelAttendance;
const eventService = __importStar(require("./event.service"));
function createEvent(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.user;
            const event = yield eventService.createEvent(req.body, userId);
            res.status(201).json({ message: "Event created successfully", data: event });
        }
        catch (error) {
            next(error);
        }
    });
}
;
function updateEvent(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const updatedEvent = yield eventService.updateEvent(id, req.body);
            res.status(200).json({ message: "Event updated successfully", data: updatedEvent });
        }
        catch (error) {
            next(error);
        }
    });
}
function deleteEvent(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const deleted = yield eventService.deleteEvent(id);
            res.status(200).json({ message: "Event deleted successfully", data: deleted });
        }
        catch (error) {
            next(error);
        }
    });
}
function attendEvent(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.user;
            const eventId = req.params.eventId;
            yield eventService.attendEvent(eventId, userId);
            res.status(200).json({ message: "Successfully joined the event" });
        }
        catch (err) {
            next(err);
        }
    });
}
;
function leaveEvent(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.user;
            const eventId = req.params.eventId;
            yield eventService.leaveEvent(eventId, userId);
            res.status(200).json({ message: "Successfully left the event" });
        }
        catch (err) {
            next(err);
        }
    });
}
function getAllEvents(_req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const events = yield eventService.getAllEvents();
            res.status(200).json({ message: "Events fetched successfully", data: events });
        }
        catch (error) {
            next(error);
        }
    });
}
;
function getEventById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const event = yield eventService.getEventById(req.params.id);
            if (!event) {
                res.status(404).json({ message: "Event not found" });
                return;
            }
            res.status(200).json({ message: "Event fetched successfully", data: event });
        }
        catch (error) {
            next(error);
        }
    });
}
;
function filterEvents(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { filters, query } = req.query;
            const parsedFilters = typeof filters === 'string' ? JSON.parse(decodeURIComponent(filters)) : filters;
            const events = yield eventService.filterEvents(parsedFilters, query);
            res.status(200).json({ message: "Events filtered successfully", data: events });
        }
        catch (error) {
            next(error);
        }
    });
}
;
function getCreatedEvents(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            const events = yield eventService.getCreatedEventsByUser(userId);
            res.status(200).json({ message: "Created events fetched successfully", data: events });
        }
        catch (error) {
            next(error);
        }
    });
}
function getJoinedEvents(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            const events = yield eventService.getJoinedEventsByUser(userId);
            res.status(200).json({ message: "Joined events fetched successfully", data: events });
        }
        catch (error) {
            next(error);
        }
    });
}
function getFavoriteEventsByUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            const events = yield eventService.getFavoriteEventsByUser(userId);
            res.status(200).json({ data: events });
        }
        catch (err) {
            next(err);
        }
    });
}
function checkEventIsFavorited(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.user;
            const eventId = req.params.eventId;
            const isFavorited = yield eventService.checkEventIsFavorited(userId, eventId);
            res.status(200).json({ isFavorited });
        }
        catch (err) {
            next(err);
        }
    });
}
function addEventFavorite(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req.user;
            const eventId = req.params.eventId;
            yield eventService.addEventFavorite(userId, eventId);
            res.status(200).json({ message: "Added to favorites" });
        }
        catch (err) {
            next(err);
        }
    });
}
function removeEventFavorite(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.userId;
            const eventId = req.params.eventId;
            yield eventService.removeEventFavorite(userId, eventId);
            res.status(200).json({ message: "Removed from favorites" });
        }
        catch (err) {
            next(err);
        }
    });
}
function cancelAttendance(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { eventId, userId } = req.params;
            yield eventService.cancelAttendance(eventId, userId);
            res.status(200).json({ message: "Attendance cancelled." });
        }
        catch (err) {
            next(err);
        }
    });
}
