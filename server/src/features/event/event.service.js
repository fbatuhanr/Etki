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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
exports.getCreatedEventsByUser = getCreatedEventsByUser;
exports.getJoinedEventsByUser = getJoinedEventsByUser;
exports.getFavoriteEventsByUser = getFavoriteEventsByUser;
exports.checkEventIsFavorited = checkEventIsFavorited;
exports.addEventFavorite = addEventFavorite;
exports.removeEventFavorite = removeEventFavorite;
exports.cancelAttendance = cancelAttendance;
const mongoose_1 = __importStar(require("mongoose"));
const user_model_1 = __importDefault(require("../user/user.model"));
const event_model_1 = __importDefault(require("./event.model"));
const event_type_model_1 = __importDefault(require("../event-type/event-type.model"));
const regex_1 = require("../../utils/regex");
function createEvent(data, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, description, type: typeId, quota, location, date, isLimitedTime, isOnline, isPrivate, isFree, entranceFee, cover, } = data;
        const type = yield event_type_model_1.default.findById(typeId);
        if (!type) {
            throw new Error("Invalid event type.");
        }
        const event = yield event_model_1.default.create({
            title,
            description,
            typeId,
            quota,
            location,
            date,
            isLimitedTime,
            isOnline,
            isPrivate,
            isFree,
            entranceFee,
            cover,
            createdBy: userId,
            participants: [userId],
        });
        return event;
    });
}
;
function updateEvent(id, updateData) {
    return __awaiter(this, void 0, void 0, function* () {
        return event_model_1.default.findByIdAndUpdate(id, updateData, { new: true });
    });
}
function deleteEvent(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return event_model_1.default.findByIdAndDelete(id);
    });
}
function attendEvent(eventId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const event = yield event_model_1.default.findById(eventId);
        if (!event) {
            throw new Error("Event not found.");
        }
        const alreadyJoined = event.participants.some((p) => p.toString() === userId);
        if (alreadyJoined) {
            throw new Error("You have already joined this event.");
        }
        event.participants.push(new mongoose_1.Types.ObjectId(userId));
        yield event.save();
    });
}
;
function leaveEvent(eventId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const event = yield event_model_1.default.findById(eventId);
        if (!event) {
            throw new Error("Event not found.");
        }
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        const isParticipant = event.participants.some((p) => p.toString() === userId);
        if (!isParticipant) {
            throw new Error("You are not a participant of this event.");
        }
        event.participants.pull(userObjectId);
        yield event.save();
    });
}
function getAllEvents() {
    return __awaiter(this, void 0, void 0, function* () {
        const events = yield event_model_1.default.find()
            .populate("typeId")
            .populate("createdBy")
            .populate("participants")
            .sort({ date: 1 })
            .lean();
        return events.map((_a) => {
            var { typeId, createdBy } = _a, rest = __rest(_a, ["typeId", "createdBy"]);
            return (Object.assign(Object.assign({}, rest), { type: typeId, creator: createdBy }));
        });
    });
}
;
function getEventById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const event = yield event_model_1.default.findById(id)
            .populate("typeId")
            .populate("createdBy")
            .populate({
            path: "participants",
            select: "username name surname photo"
        })
            .lean();
        if (!event)
            return null;
        const { typeId, createdBy } = event, rest = __rest(event, ["typeId", "createdBy"]);
        return Object.assign(Object.assign({}, rest), { type: typeId, creator: createdBy });
    });
}
;
function filterEvents(filters, query) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const match = {};
        const typeFilter = filters.find(f => f.id === "type");
        if (typeFilter === null || typeFilter === void 0 ? void 0 : typeFilter.value) {
            match.typeId = new mongoose_1.default.Types.ObjectId(typeFilter.value);
        }
        const dateFilter = filters.find(f => f.id === "date");
        if (((_a = dateFilter === null || dateFilter === void 0 ? void 0 : dateFilter.value) === null || _a === void 0 ? void 0 : _a.start) && dateFilter.value.end) {
            const start = new Date(dateFilter.value.start);
            const end = new Date(dateFilter.value.end);
            if (start.toDateString() === end.toDateString()) {
                end.setHours(23, 59, 59, 999);
            }
            match.date = {
                $gte: start,
                $lte: end,
            };
        }
        if (query) {
            const safeQuery = (0, regex_1.escapeRegex)(query);
            match.$or = [
                { title: { $regex: safeQuery, $options: "i" } },
                { description: { $regex: safeQuery, $options: "i" } },
            ];
        }
        let sort = {};
        const sortBy = (_b = filters.find(f => f.id === "sortBy")) === null || _b === void 0 ? void 0 : _b.value;
        if (sortBy === "newest") {
            sort = { createdAt: -1 };
        }
        else if (sortBy === "mostPopular") {
            sort = { participantsCount: -1 };
        }
        else {
            sort = { date: 1 };
        }
        const events = yield event_model_1.default.aggregate([
            { $match: match },
            { $addFields: { participantsCount: { $size: "$participants" } } },
            { $sort: sort },
            {
                $lookup: {
                    from: "event_types",
                    localField: "typeId",
                    foreignField: "_id",
                    as: "type",
                },
            },
            { $unwind: "$type" },
            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "creator",
                },
            },
            { $unwind: "$creator" },
            {
                $lookup: {
                    from: "users",
                    localField: "participants",
                    foreignField: "_id",
                    as: "participants",
                },
            },
            {
                $addFields: {
                    participants: {
                        $map: {
                            input: "$participants",
                            as: "p",
                            in: {
                                _id: "$$p._id",
                                username: "$$p.username",
                                name: "$$p.name",
                                surname: "$$p.surname",
                                photo: "$$p.photo",
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    participantsCount: 0,
                    typeId: 0,
                    createdBy: 0,
                },
            },
        ]);
        return events;
    });
}
;
function getCreatedEventsByUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return event_model_1.default.find({ createdBy: userId }).lean();
    });
}
;
function getJoinedEventsByUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return event_model_1.default.find({ participants: userId }).lean();
    });
}
;
function getFavoriteEventsByUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.default.findById(userId).select("favorites");
        if (!user)
            throw new Error("User not found.");
        return yield event_model_1.default.find({ _id: { $in: user.favorites } });
    });
}
function checkEventIsFavorited(userId, eventId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.default.findById(userId).select("favorites");
        if (!user)
            throw new Error("User not found.");
        return user.favorites.some((fav) => fav.toString() === eventId);
    });
}
function addEventFavorite(userId, eventId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.default.findById(userId);
        if (!user)
            throw new Error("User not found.");
        const alreadyFavorited = user.favorites.some((id) => id.toString() === eventId);
        if (alreadyFavorited)
            throw new Error("Event already favorited.");
        user.favorites.push(new mongoose_1.Types.ObjectId(eventId));
        yield user.save();
    });
}
function removeEventFavorite(userId, eventId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.default.findById(userId);
        if (!user)
            throw new Error("User not found.");
        user.favorites = user.favorites.filter((fav) => fav.toString() !== eventId);
        yield user.save();
    });
}
function cancelAttendance(eventId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const event = yield event_model_1.default.findById(eventId);
        if (!event)
            throw new Error("Event not found");
        event.participants.pull(userId);
        yield event.save();
    });
}
