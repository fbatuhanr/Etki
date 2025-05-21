import { useEffect } from "react";
import socket from "@/src/lib/socket";
import { Message } from "../types/message";

type Options = {
  eventId: string;
  userId: string;
  onNewMessage: (msg: Message) => void;
};

export const useChatSocket = ({ eventId, userId, onNewMessage }: Options) => {
  useEffect(() => {
    if (!eventId || !userId) return;

    socket.emit("register", userId);
    socket.emit("joinEventRoom", eventId);

    socket.on("newMessage", onNewMessage);

    return () => {
      socket.off("newMessage", onNewMessage);
    };
  }, [eventId, userId, onNewMessage]);
};

export const sendMessage = (eventId: string, senderId: string, content: string) => {
  socket.emit("sendMessage", { eventId, senderId, content });
};
