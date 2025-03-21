// Make sure your AuthenticatedUserContext.tsx looks like this:
import React, { createContext, useState } from 'react';
import { User } from 'firebase/auth';

interface AuthenticatedUserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthenticatedUserContext = createContext<AuthenticatedUserContextType>({
  user: null,
  setUser: () => {},
});

export const AuthenticatedUserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};
