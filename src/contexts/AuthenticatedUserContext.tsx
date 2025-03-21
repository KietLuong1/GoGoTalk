import React, { useMemo, useState, useEffect, createContext, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { User as FirebaseUser } from '@firebase/auth';

import { auth } from '../config/firebase';
import { AuthContextType } from '../commonTypes';

export const AuthenticatedUserContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

interface AuthenticatedUserProviderProps {
  children: ReactNode;
}

export const AuthenticatedUserProvider: React.FC<AuthenticatedUserProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authenticatedUser) => {
      setUser(authenticatedUser || null);
    });
    return unsubscribeAuth;
  }, []);

  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <AuthenticatedUserContext.Provider value={value}>{children}</AuthenticatedUserContext.Provider>
  );
};
