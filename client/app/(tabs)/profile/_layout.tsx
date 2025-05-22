import React from 'react';
import { Slot, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GuestGuard, UserGuard } from '@/src/guards';

const ProfileLayout = () => {
  const pathname = usePathname();
  const isPublicPage = pathname === "/profile/login" || pathname === "/profile/signup";
  const Guard = isPublicPage ? GuestGuard : UserGuard;
  return (
    <Guard>
      <SafeAreaView edges={['top']} className="flex-1 bg-white">
        <Slot />
      </SafeAreaView>
    </Guard>
  );
};

export default ProfileLayout;
