import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import Message from "./features/message/message.model";

let io: Server;
let socketUsers = new Set<string>();
let socketChatStates: { [key: string]: string | null } = {};

export const initializeSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("register", (userId: string) => {
      socketUsers.add(userId);
      socket.join(userId);
      console.log(`User ${userId} registered`);
    });

    socket.on("joinEventRoom", (eventId: string) => {
      socket.join(eventId);
      console.log(`Socket ${socket.id} joined event room ${eventId}`);
    });

    socket.on("sendMessage", async (data: {
      eventId: string;
      senderId: string;
      content: string;
    }) => {
      const { eventId, senderId, content } = data;

      if (!eventId || !senderId || !content.trim()) return;

      try {
        const message = await Message.create({
          eventId,
          sender: senderId,
          content,
        });

        const populatedMessage = await message.populate("sender", "username name surname photo");

        io.to(eventId).emit("newMessage", populatedMessage);
      } catch (error) {
        console.error("Message save/send error:", error);
      }
    });

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

export const getIO = () => io;
export const getSocketUsers = () => Array.from(socketUsers);

export const getSocketChatStates = () => socketChatStates;
export const setSocketChatState = (userId: string, chatId: string | null) => {
  socketChatStates[userId] = chatId;
};
export const clearSocketChatState = (userId: string) => {
  delete socketChatStates[userId];
};
export const clearAllSocketChatStates = () => {
  socketChatStates = {};
};

export const isSocketChatActive = (userId: string, chatId: string): boolean => {
  const activeChatId = getSocketChatStates()[userId];
  return activeChatId === chatId;
};
