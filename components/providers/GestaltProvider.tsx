'use client';

import { ReactNode } from 'react';
import { ColorSchemeProvider } from 'gestalt';

interface GestaltProviderProps {
  children: ReactNode;
}

export default function GestaltProvider({ children }: GestaltProviderProps) {
  return (
    <ColorSchemeProvider colorScheme="dark">
      {children}
    </ColorSchemeProvider>
  );
}
