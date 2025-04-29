import React from 'react';
import { UserGuard } from '@/src/guards';
import MainProfile from '@/src/components/profile/MainProfile';

const Profile = () => {

  return (
    <UserGuard>
      <MainProfile />
    </UserGuard>
  )
}

export default Profile;