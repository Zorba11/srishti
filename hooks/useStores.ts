'use client';
import { StoreContext } from '@/stores/config/StoreContext';
import { useContext } from 'react';

export function useStores() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
