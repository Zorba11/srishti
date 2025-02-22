'use client';
import { createContext } from 'react';
import rootStore from './RootStore';

interface StoreContextType {
  rootStore: typeof rootStore;
}

export const StoreContext = createContext<StoreContextType>({
  rootStore,
});
