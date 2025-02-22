'use client';
import rootStore from '@/stores/config/RootStore';
import { StoreContext } from '@/stores/config/StoreContext';
import { ReactNode, useState } from 'react';

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <StoreContext.Provider
      value={{
        rootStore,
      }}
    >
      {/* {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )} */}
      {children}
    </StoreContext.Provider>
  );
}
