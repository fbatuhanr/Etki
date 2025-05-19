import React from 'react';
import ManageEvent from '@/src/components/ManageEvent';
import { useLocalSearchParams } from 'expo-router';

const EditEvent = () => {
  const { id } = useLocalSearchParams();
  const safeId = typeof id === 'string' ? id : undefined;
  return <ManageEvent id={safeId} />
}

export default EditEvent