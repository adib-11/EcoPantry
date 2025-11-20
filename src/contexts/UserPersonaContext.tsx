import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserType = 'individual' | 'family' | 'community';

interface UserPersonaContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
}

const UserPersonaContext = createContext<UserPersonaContextType | undefined>(undefined);

export const UserPersonaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from localStorage or default to 'individual'
  const [userType, setUserTypeState] = useState<UserType>(() => {
    const stored = localStorage.getItem('userType');
    return (stored as UserType) || 'individual';
  });

  // Persist to localStorage whenever userType changes
  useEffect(() => {
    localStorage.setItem('userType', userType);
  }, [userType]);

  const setUserType = (type: UserType) => {
    setUserTypeState(type);
  };

  return (
    <UserPersonaContext.Provider value={{ userType, setUserType }}>
      {children}
    </UserPersonaContext.Provider>
  );
};

// Custom hook to use the context
export const useUserPersona = () => {
  const context = useContext(UserPersonaContext);
  if (context === undefined) {
    throw new Error('useUserPersona must be used within a UserPersonaProvider');
  }
  return context;
};
