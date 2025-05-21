import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, TextInput, Button, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useDecodedToken } from "@/src/hooks/common/useDecodedToken";
import { useChatSocket, sendMessage } from "@/src/hooks/useChatSocket";
import { Message } from "@/src/types/message";
import NuText from "@/src/components/NuText";
import useAxios from "@/src/hooks/common/useAxios";
import { Image } from "expo-image";
import { defaultUserCover } from "@/src/data/defaultValues";
import { imageBlurHash } from "@/src/constants/images";
import { useMessage } from "@/src/hooks/useMessage";
import { set } from "react-hook-form";
import { StatusBar } from "expo-status-bar";

const ChatScreen = () => {
  const axiosInstance = useAxios();
  const { eventId, title } = useLocalSearchParams<{ eventId: string; title?: string }>();
  const { userId } = useDecodedToken();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const { getMessages } = useMessage();


  const fetchData = async () => {
    const response = await getMessages(eventId);
    setMessages(response);
  };

  const handleNewMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  useEffect(() => {
    if (!eventId) return;
    fetchData();
  }, [eventId]);

  useChatSocket({
    eventId,
    userId,
    onNewMessage: handleNewMessage,
  });

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(eventId, userId, input.trim());
    setInput("");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <StatusBar style="light" />
      <View className="flex-1 px-4 gap-y-4">
        <View className="border-b">
          <NuText variant="bold" className="text-3xl mb-4 text-center">{title}</NuText>
        </View>
        <FlatList
          data={messages}
          keyExtractor={(m) => m._id}
          renderItem={({ item, index }) => {
            const previousMessage = messages[index - 1];
            const isSameSenderAsPrevious =
              previousMessage && previousMessage.sender._id === item.sender._id;

            const isOwnMessage = item.sender._id === userId;
            const containerStyle = isOwnMessage
              ? "self-end bg-primary text-white rounded-t-xl rounded-bl-xl"
              : "self-start bg-neutral-200 text-black rounded-t-xl rounded-br-xl";

            return (
              <View className={`mb-2 max-w-[95%] ${isOwnMessage ? "items-end" : "items-start"}`}>
                {!isSameSenderAsPrevious && (
                  <View className="mb-1 flex-row items-center gap-x-2">
                    {!isOwnMessage && (
                      <View className="w-6 h-6 rounded-full overflow-hidden">
                        <Image
                          source={item.sender.photo || defaultUserCover}
                          contentFit="cover"
                          style={{ width: "100%", height: "100%" }}
                        />
                      </View>
                    )}
                    <NuText variant="medium" className="text-sm text-grayish">
                      {isOwnMessage ? "You" : item.sender.name}
                    </NuText>
                  </View>
                )}

                <View className={`px-4 py-2 ${containerStyle}`}>
                  <NuText variant="regular" className={isOwnMessage ? "text-white" : "text-black"}>
                    {item.content}
                  </NuText>
                </View>
              </View>
            );
          }}
        />
        <View className="flex-row items-center gap-x-2 mt-4">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Write a message..."
            className="flex-1 border rounded px-4 py-2"
          />
          <Button title="Send" onPress={handleSend} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
