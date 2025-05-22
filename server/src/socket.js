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
exports.isSocketChatActive = exports.clearAllSocketChatStates = exports.clearSocketChatState = exports.setSocketChatState = exports.getSocketChatStates = exports.getSocketUsers = exports.getIO = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const message_model_1 = __importDefault(require("./features/message/message.model"));
let io;
let socketUsers = new Set();
let socketChatStates = {};
const initializeSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || "http://localhost:3000",
            credentials: true,
        },
    });
    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);
        // 🔐 Kullanıcı register oluyor (kendi ID’siyle odasına giriyor)
        socket.on("register", (userId) => {
            socketUsers.add(userId);
            socket.join(userId);
            console.log(`User ${userId} registered`);
        });
        // ✅ Etkinlik odasına katılma
        socket.on("joinEventRoom", (eventId) => {
            socket.join(eventId);
            console.log(`Socket ${socket.id} joined event room ${eventId}`);
        });
        // ✉️ Mesaj gönderme
        socket.on("sendMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { eventId, senderId, content } = data;
            if (!eventId || !senderId || !content.trim())
                return;
            try {
                const message = yield message_model_1.default.create({
                    eventId,
                    sender: senderId,
                    content,
                });
                const populatedMessage = yield message.populate("sender", "username name surname photo");
                // 🔄 Odaya mesajı yayınla
                io.to(eventId).emit("newMessage", populatedMessage);
            }
            catch (error) {
                console.error("Message save/send error:", error);
            }
        }));
        // ❌ Bağlantı kesildiğinde kullanıcıyı kaldır
        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
            socketUsers.forEach((userId) => {
                if (socket.id === userId) {
                    socketUsers.delete(userId);
                }
            });
        });
    });
};
exports.initializeSocket = initializeSocket;
const getIO = () => io;
exports.getIO = getIO;
const getSocketUsers = () => Array.from(socketUsers);
exports.getSocketUsers = getSocketUsers;
const getSocketChatStates = () => socketChatStates;
exports.getSocketChatStates = getSocketChatStates;
const setSocketChatState = (userId, chatId) => {
    socketChatStates[userId] = chatId;
};
exports.setSocketChatState = setSocketChatState;
const clearSocketChatState = (userId) => {
    delete socketChatStates[userId];
};
exports.clearSocketChatState = clearSocketChatState;
const clearAllSocketChatStates = () => {
    socketChatStates = {};
};
exports.clearAllSocketChatStates = clearAllSocketChatStates;
const isSocketChatActive = (userId, chatId) => {
    const activeChatId = (0, exports.getSocketChatStates)()[userId];
    return activeChatId === chatId;
};
exports.isSocketChatActive = isSocketChatActive;
