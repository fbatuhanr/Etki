import NuText from '@/src/components/NuText';
import { SearchIcon } from '@/src/components/Vectors';
import { imageBlurHash } from '@/src/constants/images';
import { defaultUserCover } from '@/src/data/defaultValues';
import useAxios from '@/src/hooks/common/useAxios';
import { useDebouncedValue } from '@/src/hooks/common/useDebouncedValue';
import { useDecodedToken } from '@/src/hooks/common/useDecodedToken';
import { useFriend } from '@/src/hooks/friend/useFriend';
import { useUser } from '@/src/hooks/user/useUser';
import { Friend, FriendRequestWithUser } from '@/src/types/friend';
import { UserFound } from '@/src/types/user';
import { clipText } from '@/src/utils/textUtils';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
const Friends = () => {

    const decodedToken = useDecodedToken();

    const { searchUsers } = useUser();
    const [userResults, setUserResults] = useState<UserFound[]>([]);
    const [search, setSearch] = useState<string | null>(null);
    const debouncedSearch = useDebouncedValue(search, 500);

    const {
        onProgress,
        getIncomingRequests,
        sendFriendRequest,
        getFriendsOfUser,
        removeFriend,
        cancelFriendRequestByUser,
        acceptFriendRequestByUser,
        rejectFriendRequestByUser
    } = useFriend();
    const [friends, setFriends] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState<FriendRequestWithUser[]>([]);
    
    const fetchData = async () => {
        const [friends, incomingRequests] = await Promise.all([
            getFriendsOfUser(decodedToken.userId),
            getIncomingRequests()
        ])
        setFriends(friends);
        setIncomingRequests(incomingRequests);
    };
    useEffect(() => {
        fetchData();
    }, []);

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
        const updatedUsers = await searchUsers(debouncedSearch || '');
        console.log('updatedUsers:', updatedUsers);
        setUserResults(updatedUsers);
    };

    const handleCancelRequest = async (userId: string) => {
        if (!debouncedSearch) return;
        await cancelFriendRequestByUser(userId);
        const updatedUsers = await searchUsers(debouncedSearch);
        setUserResults(updatedUsers);
    };

    const handleAcceptRequest = async (userId: string) => {
        await acceptFriendRequestByUser(userId);
    };
    const handleRejectRequest = async (userId: string) => {
        await rejectFriendRequestByUser(userId);
    };

    return (
        <SafeAreaView edges={['top']} className='flex-1 pt-14'>
            <ScrollView className='px-5'>
                <View>
                    <NuText variant='bold' className='text-3xl mb-2 border-b border-neutral-200 pb-1'>Find Your Friend</NuText>
                    <View className='w-full h-12 flex-row items-center gap-x-2 bg-primary px-4 rounded shadow'>
                        <View><SearchIcon width={22} height={22} /></View>
                        <TextInput
                            value={search || ''}
                            placeholder='Type here to search...'
                            placeholderTextColor="#FFFFFF"
                            onChangeText={setSearch}
                            className='flex-1 h-12 text-white font-nunitoMedium'
                        />
                        {
                            search &&
                            <TouchableOpacity onPress={() => setSearch('')} disabled={onProgress} className='w-10 h-10 justify-center items-center'>
                                <AntDesign name="close" size={24} color="white" />
                            </TouchableOpacity>
                        }
                    </View>
                    <View className='mt-2 gap-y-2'>
                        {
                            userResults.length > 0 && userResults.map((user: UserFound) => (
                                <View key={user._id} className="w-full h-24 bg-primary rounded p-4 flex flex-row justify-between items-center shadow">
                                    <View className='flex-row items-center gap-x-4'>
                                        <Link href={`/profile/${user._id}`}>
                                            <View className='w-16 h-16 rounded-full overflow-hidden'>
                                                <Image
                                                    source={user?.photo || defaultUserCover}
                                                    contentFit="cover"
                                                    transition={500}
                                                    placeholder={{ blurhash: imageBlurHash }}
                                                    style={{ width: "100%", height: "100%" }}
                                                />
                                            </View>
                                        </Link>
                                        <Link href={`/profile/${user._id}`}>
                                            <View>
                                                <NuText variant='bold' className='text-xl text-white'>{`${clipText(user.name, 9)} ${clipText(user.surname, 5)}`}</NuText>
                                                <NuText variant='regular' className='text-white'>{`@${user.username}`}</NuText>
                                            </View>
                                        </Link>
                                    </View>
                                    {
                                        user.hasPendingRequest ?
                                            <TouchableOpacity onPress={() => handleCancelRequest(user._id)} disabled={onProgress} className='w-32 bg-red-700 justify-between items-center rounded p-2'>
                                                <AntDesign name="adduser" size={24} color="white" />
                                                <NuText variant='bold' className='text-sm text-white'>Cancel Request</NuText>
                                            </TouchableOpacity>
                                            :
                                            <TouchableOpacity onPress={() => handleSendRequest(user._id)} disabled={onProgress} className='w-32 bg-primaryActive justify-between items-center rounded p-2'>
                                                <AntDesign name="adduser" size={24} color="white" />
                                                <NuText variant='bold' className='text-sm text-white'>Send Request</NuText>
                                            </TouchableOpacity>
                                    }
                                </View>
                            ))
                        }
                    </View>
                </View>
                <View className='mt-8'>
                    <NuText variant='bold' className='text-3xl mb-2 border-b border-neutral-200 pb-1'>Incoming Requests {`(${incomingRequests.length})`}</NuText>
                    {
                        incomingRequests.length > 0 ? incomingRequests.map((friendReqUser: FriendRequestWithUser) => (
                            <View key={friendReqUser._id} className="w-full h-24 bg-primary rounded p-4 flex flex-row justify-between items-center shadow">
                                <Link href={`/profile/${friendReqUser?.from._id}`}>
                                    <View className='w-16 h-16 rounded-full overflow-hidden'>
                                        <Image
                                            source={friendReqUser?.from.photo || defaultUserCover}
                                            contentFit="cover"
                                            transition={500}
                                            placeholder={{ blurhash: imageBlurHash }}
                                            style={{ width: "100%", height: "100%" }}
                                        />
                                    </View>
                                </Link>
                                <Link href={`/profile/${friendReqUser?.from._id}`}>
                                    <View >
                                        <NuText variant='bold' className='text-2xl text-white'>{`${friendReqUser?.from.name} ${friendReqUser?.from.surname}`}</NuText>
                                        <NuText variant='regular' className='text-white'>{`@${friendReqUser?.from.username}`}</NuText>
                                    </View>
                                </Link>
                                <TouchableOpacity onPress={() => handleAcceptRequest(friendReqUser?.from._id)} disabled={onProgress} className='bg-red-700 justify-between items-center rounded p-2'>
                                    <AntDesign name="deleteuser" size={24} color="white" />
                                    <NuText variant='bold' className='text-white'>Reject Request</NuText>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleRejectRequest(friendReqUser?.from._id)} disabled={onProgress} className='bg-red-700 justify-between items-center rounded p-2'>
                                    <AntDesign name="deleteuser" size={24} color="white" />
                                    <NuText variant='bold' className='text-white'>Reject Request</NuText>
                                </TouchableOpacity>
                            </View>
                        ))
                            :
                            <View>
                                <NuText variant='regular' className='text-neutral-800 mt-4'>
                                    You don't have any incoming requests.
                                </NuText>
                            </View>
                    }
                </View>
                <View className='mt-8'>
                    <NuText variant='bold' className='text-3xl mb-2 border-b border-neutral-200 pb-1'>Friends List {`(${friends.length})`}</NuText>
                    {
                        friends.length > 0 ? friends.map((friend: Friend) => (
                            <View key={friend._id} className="w-full h-24 bg-primary rounded p-4 flex flex-row justify-between items-center shadow">
                                <Link href={`/profile/${friend._id}`}>
                                    <View className='w-16 h-16 rounded-full overflow-hidden'>
                                        <Image
                                            source={friend?.photo || defaultUserCover}
                                            contentFit="cover"
                                            transition={500}
                                            placeholder={{ blurhash: imageBlurHash }}
                                            style={{ width: "100%", height: "100%" }}
                                        />
                                    </View>
                                </Link>
                                <Link href={`/profile/${friend._id}`}>
                                    <View >
                                        <NuText variant='bold' className='text-2xl text-white'>{`${friend.name} ${friend.surname}`}</NuText>
                                        <NuText variant='regular' className='text-white'>{`@${friend.username}`}</NuText>
                                    </View>
                                </Link>
                                <TouchableOpacity onPress={() => removeFriend(friend._id)} disabled={onProgress} className='bg-primaryActive justify-between items-center rounded p-2'>
                                    <AntDesign name="deleteuser" size={24} color="white" />
                                    <NuText variant='bold' className='text-white'>Unfriend</NuText>
                                </TouchableOpacity>
                            </View>
                        ))
                            :
                            <View>
                                <NuText variant='regular' className='text-neutral-800 mt-4'>
                                    You don't have any friends yet.
                                </NuText>
                                <NuText variant='regular' className='text-neutral-800 mt-2'>
                                    Search for your friends and send them a friend request.
                                </NuText>
                            </View>
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
export default Friends;