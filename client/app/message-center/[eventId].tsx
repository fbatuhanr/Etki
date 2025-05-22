import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, TextInput, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, TouchableOpacity } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { useDecodedToken } from "@/src/hooks/common/useDecodedToken";
import { useChatSocket, sendMessage } from "@/src/hooks/useChatSocket";
import { Message } from "@/src/types/message";
import NuText from "@/src/components/NuText";
import { Image } from "expo-image";
import { defaultUserCover } from "@/src/data/defaultValues";
import { useMessage } from "@/src/hooks/useMessage";
import { cn } from "@/src/lib/utils";
import { SafeAreaView } from "react-native-safe-area-context";
import { clipText } from "@/src/utils/textUtils";
import { useEvent } from "@/src/hooks/event/useEvent";
import { Event } from "@/src/types/event";
import Feather from '@expo/vector-icons/Feather';

const Chat = () => {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { userId } = useDecodedToken();

  const { getMessages } = useMessage();
  const { getEventById } = useEvent();

  const [messages, setMessages] = useState<Message[]>([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [input, setInput] = useState("");

  const flatListRef = useRef<FlatList>(null);

  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const [messages, event] = await Promise.all([
      getMessages(eventId),
      getEventById(eventId),
    ]);
    setMessages(messages);
    setEvent(event);
    setIsLoading(false);
  };
  useEffect(() => {
    if (!eventId) return;
    fetchData();
  }, [eventId]);

  const handleNewMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg]);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 50);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(eventId, userId, input.trim());
    setInput("");
  };

  useChatSocket({
    eventId,
    userId,
    onNewMessage: handleNewMessage,
  });

  useEffect(() => {
    if (!eventId) return;
    fetchData().then(() => {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    });
  }, [eventId]);

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 items-center justify-center'>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView edges={['top']} className="flex-1 pt-16">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <View className="flex-1 px-4 gap-y-4">
          <View className="flex-row justify-between items-end border-b pb-2">
            <NuText variant="bold" className="text-3xl text-center">{clipText(event?.title || '', 8)}</NuText>
            <Link href={`/details/${eventId}`}>
              <View className="bg-primary px-3 py-2 rounded">
                <NuText variant="semiBold" className="text-white text-lg text-center">View Event</NuText>
              </View>
            </Link>
          </View>
          <FlatList
            className="flex-1"
            contentContainerClassName="pb-4"
            data={messages}
            ref={flatListRef}
            keyExtractor={(m) => m._id}
            renderItem={({ item, index }) => {
              const previousMessage = messages[index - 1];
              const isSameSenderAsPrevious =
                previousMessage && previousMessage.sender._id === item.sender._id;

              const isOwnMessage = item.sender._id === userId;
              const containerStyle = isOwnMessage
                ? "self-end bg-primary text-white rounded-t-xl rounded-bl-xl"
                : "self-start ml-10 bg-neutral-200 text-black rounded-t-xl rounded-br-xl";

              return (
                <View className={cn(
                  isOwnMessage ? "items-end" : "items-start",
                  isSameSenderAsPrevious ? "mt-1" : "mt-4"
                )}>
                  {!isSameSenderAsPrevious && (
                    <View className="mb-1 flex-row items-center gap-x-2">
                      {!isOwnMessage && (
                        <Link href={`/profile/${item.sender._id}`}>
                          <View className="w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              source={item.sender.photo || defaultUserCover}
                              contentFit="cover"
                              style={{ width: "100%", height: "100%" }}
                            />
                          </View>
                        </Link>
                      )}

                      <NuText variant="bold" className="text-lg text-neutral-800">
                        {isOwnMessage ? "You" : item.sender.name}
                      </NuText>
                    </View>
                  )}

                  <View className={`px-4 py-2 ${containerStyle}`}>
                    <NuText variant="regular" className={cn(
                      'text-base',
                      cn(isOwnMessage ? "max-w-[90%] text-white" : "text-black")
                    )}>
                      {item.content}{item.content}{item.content}{item.content}{item.content}{item.content}{item.content}{item.content}{item.content}{item.content}{item.content}{item.content}{item.content}{item.content}{item.content}
                    </NuText>
                  </View>
                </View>
              );
            }}
          />
          <View className="flex-row items-center gap-x-2 -mx-4 mb-12 px-4">
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Write a message..."
              className="flex-1 border rounded px-4 py-2 text-lg"
            />
            <TouchableOpacity onPress={handleSend} className="px-4">
              <Feather name="send" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;
