import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useEvent } from "@/src/hooks/event/useEvent";
import { useDecodedToken } from "@/src/hooks/common/useDecodedToken";
import { Event, EventChat } from "@/src/types/event";
import NuText from "@/src/components/NuText";
import { router } from "expo-router";
import { Image } from "expo-image";
import { imageBlurHash } from "@/src/constants/images";
import { useMessage } from "@/src/hooks/useMessage";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";

const MessageCenter = () => {
  const decodedToken = useDecodedToken();
  const [isLoading, setIsLoading] = useState(true);

  const { getJoinedEvents } = useEvent();
  const { getMessageCountsByEventIds } = useMessage();
  const [eventChats, setEventChats] = useState<EventChat[]>([]);

  const fetchData = async () => {
    try {
      const events = await getJoinedEvents(decodedToken.userId);
      const messageCounts = await getMessageCountsByEventIds(events.map((i: Event) => i._id));
      const eventChatsWithCounts: EventChat[] = events.map((event: Event) => ({
        ...event,
        count: messageCounts?.[event._id] || 0,
      }));
      setEventChats(eventChatsWithCounts);
    } catch (err) {
      console.error("Failed to fetch joined events", err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 items-center justify-center'>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1">
      <View className="pt-16 px-4">
        <NuText variant="bold" className="text-3xl mb-4">Message Center</NuText>
        <FlatList
          data={eventChats}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View className="w-full h-28 mb-3 shadow rounded-2xl bg-white">
              <View className="overflow-hidden rounded-2xl">
                <Image
                  source={item.cover}
                  contentFit="cover"
                  transition={500}
                  placeholder={{ blurhash: imageBlurHash }}
                  style={{ width: "100%", height: "100%" }}
                />
                <TouchableOpacity
                  onPress={() => router.push(`/message-center/${item._id}`)}
                  className='absolute inset-0 items-center justify-center bg-primary/50'
                >
                  <View className="flex-row justify-between px-24 w-full items-center">
                    <View>
                      <NuText variant="bold" className="text-white text-3xl">
                        {item.title}
                      </NuText>
                      <NuText variant="medium" className="text-white text-base">
                        {new Date(item.date).toLocaleDateString()}
                      </NuText>
                    </View>
                    <View className="flex-row items-center gap-x-2">
                      <AntDesign name="message1" size={24} color="white" />
                      <NuText variant="bold" className="text-white text-2xl">
                        {item.count}
                      </NuText>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

          )
          }
          ListEmptyComponent={
            <NuText variant="regular" className="text-neutral-500 mt-8 text-center" >
              You haven't joined any events yet.
            </NuText >
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default MessageCenter;