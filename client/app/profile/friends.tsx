import React, { useState, useEffect, useCallback } from 'react';
import { TouchableOpacity, View, TextInput, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import AntDesign from '@expo/vector-icons/AntDesign';
import Animated, { FadeInUp } from 'react-native-reanimated';
import NuText from '@/src/components/NuText';
import { SearchIcon } from '@/src/components/Vectors';
import { imageBlurHash } from '@/src/constants/images';
import { defaultUserCover } from '@/src/data/defaultValues';
import { useDebouncedValue } from '@/src/hooks/common/useDebouncedValue';
import { useDecodedToken } from '@/src/hooks/common/useDecodedToken';
import { useFriend } from '@/src/hooks/friend/useFriend';
import { useUser } from '@/src/hooks/user/useUser';
import { Friend, IncomingFriendRequestWithUser, SentFriendRequestWithUser } from '@/src/types/friend';
import { UserSearch } from '@/src/types/user';
import { clipText } from '@/src/utils/textUtils';
import { Link, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const Friends = () => {
    const decodedToken = useDecodedToken();
    const [isLoading, setIsLoading] = useState(true);

    const { searchUsers } = useUser();
    const [userResults, setUserResults] = useState<UserSearch[]>([]);
    const [search, setSearch] = useState<string | null>(null);
    const debouncedSearch = useDebouncedValue(search, 500);

    const {
        onProgress,
        getIncomingRequests,
        getSentRequests,
        sendFriendRequest,
        getFriendsOfUser,
        removeFriend,
        cancelFriendRequestByUser,
        acceptFriendRequestByUser,
        rejectFriendRequestByUser,
        cleanUpAcceptedRequests
    } = useFriend();

    const [friends, setFriends] = useState<Friend[]>([]);
    const [incomingRequests, setIncomingRequests] = useState<IncomingFriendRequestWithUser[]>([]);
    const [sentRequests, setSentRequests] = useState<SentFriendRequestWithUser[]>([]);

    const fetchData = async () => {
        setIsLoading(true);
        await cleanUpAcceptedRequests();
        const [friends, incomingRequests, sentRequests] = await Promise.all([
            getFriendsOfUser(decodedToken.userId),
            getIncomingRequests(),
            getSentRequests(),
        ]);
        setFriends(friends);
        setIncomingRequests(incomingRequests);
        setSentRequests(sentRequests);
        setIsLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    useEffect(() => {
        if (typeof debouncedSearch !== 'string') return;
        if (debouncedSearch.trim() !== '') {
            const fetchData = async () => {
                const users = await searchUsers(debouncedSearch);
                setUserResults(users);
            };
            fetchData();
        } else {
            setUserResults([]);
        }
    }, [debouncedSearch]);

    const handleSendRequest = async (userId: string) => {
        await sendFriendRequest(userId);
        if (debouncedSearch)
            setUserResults(await searchUsers(debouncedSearch));
        fetchData();
    };

    const handleCancelRequest = async (userId: string) => {
        await cancelFriendRequestByUser(userId);
        if (debouncedSearch)
            setUserResults(await searchUsers(debouncedSearch));
        fetchData();
    };

    const handleAcceptRequest = async (userId: string) => {
        setSearch('');
        await acceptFriendRequestByUser(userId);
        fetchData();
    };

    const handleRejectRequest = async (userId: string) => {
        setSearch('');
        await rejectFriendRequestByUser(userId);
        fetchData();
    };

    const handleRemoveFriend = async (userId: string) => {
        setSearch('');
        await removeFriend(userId);
        fetchData();
    };

    if (isLoading) {
        return (
            <SafeAreaView className='flex-1 items-center justify-center'>
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }
    return (
        <SafeAreaView edges={['top']} className="flex-1 pt-14">
            <StatusBar style="light" />
            <ScrollView className="px-5">
                <View>
                    <NuText variant="bold" className="text-3xl mb-2 border-b border-neutral-200 pb-1">Find Your Friend</NuText>
                    <View className="w-full h-12 flex-row items-center gap-x-2 bg-primary px-4 rounded shadow">
                        <SearchIcon width={22} height={22} />
                        <TextInput
                            value={search || ''}
                            placeholder="Type here to search..."
                            placeholderTextColor="#FFFFFF"
                            onChangeText={setSearch}
                            className="flex-1 h-12 text-white font-nunitoMedium leading-6"
                        />
                        {search && (
                            <TouchableOpacity onPress={() => setSearch('')} disabled={onProgress} className="w-10 h-10 justify-center items-center">
                                <AntDesign name="close" size={24} color="white" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <View className="mt-2 gap-y-2">
                        {userResults.map((user: UserSearch) => (
                            <Animated.View
                                key={user._id}
                                entering={FadeInUp.delay(50)}
                                className="w-full h-24 bg-primary rounded p-4 flex flex-row mt-2 justify-between items-center shadow"
                            >
                                <View className="flex-row items-center gap-x-4">
                                    <Link href={`/profile/${user._id}`}>
                                        <View className="w-16 h-16 rounded-full overflow-hidden">
                                            <Image
                                                source={user.photo || defaultUserCover}
                                                contentFit="cover"
                                                transition={250}
                                                placeholder={{ blurhash: imageBlurHash }}
                                                style={{ width: '100%', height: '100%' }}
                                            />
                                        </View>
                                    </Link>
                                    <Link href={`/profile/${user._id}`}>
                                        <View>
                                            <NuText variant="bold" className="text-xl text-white">{`${clipText(user.name, 9)} ${clipText(user.surname, 5)}`}</NuText>
                                            <NuText variant="regular" className="text-white">@{user.username}</NuText>
                                        </View>
                                    </Link>
                                </View>
                                {user.hasPendingRequest ? (
                                    <TouchableOpacity onPress={() => handleCancelRequest(user._id)} disabled={onProgress} className="w-32 bg-red-700 justify-between items-center rounded p-2">
                                        <AntDesign name="adduser" size={24} color="white" />
                                        <NuText variant="bold" className="text-sm text-white">Cancel Request</NuText>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity onPress={() => handleSendRequest(user._id)} disabled={onProgress} className="w-32 bg-primaryActive justify-between items-center rounded p-2">
                                        <AntDesign name="adduser" size={24} color="white" />
                                        <NuText variant="bold" className="text-sm text-white">Send Request</NuText>
                                    </TouchableOpacity>
                                )}
                            </Animated.View>
                        ))}
                    </View>
                </View>

                <View className="mt-8">
                    <NuText variant="bold" className="text-3xl mb-2 border-b border-neutral-200 pb-1">Sent Requests ({sentRequests.length})</NuText>
                    {sentRequests.length > 0 ? (
                        sentRequests.map((req: SentFriendRequestWithUser) => (
                            <Animated.View
                                key={req._id}
                                entering={FadeInUp.delay(50)}
                                className="w-full h-24 bg-primary rounded p-4 flex flex-row mt-2 justify-between items-center shadow"
                            >
                                <View className="flex-row items-center gap-x-4">
                                    <Link href={`/profile/${req.to._id}`}>
                                        <View className="w-16 h-16 rounded-full overflow-hidden">
                                            <Image
                                                source={req.to.photo || defaultUserCover}
                                                contentFit="cover"
                                                transition={250}
                                                placeholder={{ blurhash: imageBlurHash }}
                                                style={{ width: '100%', height: '100%' }}
                                            />
                                        </View>
                                    </Link>
                                    <Link href={`/profile/${req.to._id}`}>
                                        <View>
                                            <NuText variant="bold" className="text-2xl text-white">{`${clipText(req.to.name, 9)} ${clipText(req.to.surname, 5)}`}</NuText>
                                            <NuText variant="regular" className="text-white">@{req.to.username}</NuText>
                                        </View>
                                    </Link>
                                </View>
                                <View className="flex-row gap-x-2">
                                    <TouchableOpacity onPress={() => handleCancelRequest(req.to._id)} disabled={onProgress} className="w-22 bg-red-700 justify-between items-center rounded p-2">
                                        <AntDesign name="deleteuser" size={24} color="white" />
                                        <NuText variant="bold" className="text-white">Cancel</NuText>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        ))
                    ) : (
                        <Animated.View entering={FadeInUp.delay(50)}>
                            <NuText variant="regular" className="text-neutral-800 mt-4">
                                You don't have any incoming requests.
                            </NuText>
                        </Animated.View>
                    )}
                </View>

                <View className="mt-8">
                    <NuText variant="bold" className="text-3xl mb-2 border-b border-neutral-200 pb-1">Incoming Requests ({incomingRequests.length})</NuText>
                    {incomingRequests.length > 0 ? (
                        incomingRequests.map((req: IncomingFriendRequestWithUser) => (
                            <Animated.View
                                key={req._id}
                                entering={FadeInUp.delay(50)}
                                className="w-full h-24 bg-primary rounded p-4 flex flex-row mt-2 justify-between items-center shadow"
                            >
                                <View className="flex-row items-center gap-x-4">
                                    <Link href={`/profile/${req.from._id}`}>
                                        <View className="w-16 h-16 rounded-full overflow-hidden">
                                            <Image
                                                source={req.from.photo || defaultUserCover}
                                                contentFit="cover"
                                                transition={250}
                                                placeholder={{ blurhash: imageBlurHash }}
                                                style={{ width: '100%', height: '100%' }}
                                            />
                                        </View>
                                    </Link>
                                    <Link href={`/profile/${req.from._id}`}>
                                        <View>
                                            <NuText variant="bold" className="text-2xl text-white">{`${clipText(req.from.name, 9)} ${clipText(req.from.surname, 5)}`}</NuText>
                                            <NuText variant="regular" className="text-white">@{req.from.username}</NuText>
                                        </View>
                                    </Link>
                                </View>
                                <View className="flex-row gap-x-2">
                                    <TouchableOpacity onPress={() => handleRejectRequest(req.from._id)} disabled={onProgress} className="w-22 bg-red-700 justify-between items-center rounded p-2">
                                        <AntDesign name="deleteuser" size={24} color="white" />
                                        <NuText variant="bold" className="text-white">Reject</NuText>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleAcceptRequest(req.from._id)} disabled={onProgress} className="w-22 bg-primaryActive justify-between items-center rounded p-2">
                                        <AntDesign name="adduser" size={24} color="white" />
                                        <NuText variant="bold" className="text-white">Accept</NuText>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        ))
                    ) : (
                        <Animated.View entering={FadeInUp.delay(50)}>
                            <NuText variant="regular" className="text-neutral-800 mt-4">
                                You don't have any incoming requests.
                            </NuText>
                        </Animated.View>
                    )}
                </View>

                <View className="mt-8">
                    <NuText variant="bold" className="text-3xl mb-2 border-b border-neutral-200 pb-1">Friend List ({friends.length})</NuText>
                    {friends.length > 0 ? (
                        friends.map((friend) => (
                            <Animated.View
                                key={friend._id}
                                entering={FadeInUp.delay(50)}
                                className="w-full h-24 bg-primary rounded mt-2 p-4 flex flex-row justify-between items-center shadow"
                            >
                                <View className="flex-row items-center gap-x-4">
                                    <Link href={`/profile/${friend._id}`}>
                                        <View className="w-16 h-16 rounded-full overflow-hidden">
                                            <Image
                                                source={friend.photo || defaultUserCover}
                                                contentFit="cover"
                                                transition={250}
                                                placeholder={{ blurhash: imageBlurHash }}
                                                style={{ width: '100%', height: '100%' }}
                                            />
                                        </View>
                                    </Link>
                                    <Link href={`/profile/${friend._id}`}>
                                        <View>
                                            <NuText variant="bold" className="text-2xl text-white">{`${friend.name} ${friend.surname}`}</NuText>
                                            <NuText variant="regular" className="text-white">@{friend.username}</NuText>
                                        </View>
                                    </Link>
                                </View>
                                <TouchableOpacity onPress={() => handleRemoveFriend(friend._id)} disabled={onProgress} className="bg-primaryActive justify-between items-center rounded p-2">
                                    <AntDesign name="deleteuser" size={24} color="white" />
                                    <NuText variant="bold" className="text-white">Unfriend</NuText>
                                </TouchableOpacity>
                            </Animated.View>
                        ))
                    ) : (
                        <Animated.View entering={FadeInUp.delay(50)}>
                            <NuText variant="regular" className="text-neutral-800 mt-4">
                                You don't have any friends yet.
                            </NuText>
                            <NuText variant="regular" className="text-neutral-800 mt-2">
                                Search for your friends and send them a friend request.
                            </NuText>
                        </Animated.View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Friends;
