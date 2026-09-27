import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWebAuthn } from '../hooks/useWebAuthn';
import type { ForensicsError } from '../types/errors';
import type { MumbaiPoliceRank } from '../types/database';

export interface OfficerProfile {
  id: string;
  sevarthId: string;
  badgeNumber: string;
  fullName: string;
  fullNameMarathi: string;
  policeRank: MumbaiPoliceRank;
  policeStation: string;
  policeZone: string;
  clearanceLevel: number;
}

export const SEEDED_OFFICERS: Record<string, OfficerProfile> = {
  'MH-POL-40211': {
    id: '11111111-1111-4111-a111-111111111111',
    sevarthId: 'MH-POL-40211',
    badgeNumber: 'API-7721',
    fullName: 'Sachin Kadam',
    fullNameMarathi: 'सचिन कदम',
    policeRank: 'ASSISTANT_POLICE_INSPECTOR',
    policeStation: 'BKC Cyber Crime Police Station',
    policeZone: 'Zone VIII',
    clearanceLevel: 3,
  },
  'MH-POL-10842': {
    id: '22222222-2222-4222-a222-222222222222',
    sevarthId: 'MH-POL-10842',
    badgeNumber: 'HC-4091',
    fullName: 'Ramesh Patil',
    fullNameMarathi: 'रमेश पाटील',
    policeRank: 'HEAD_CONSTABLE',
    policeStation: 'Azad Maidan Police Station',
    policeZone: 'Zone I',
    clearanceLevel: 2,
  },
  'MH-JUD-00812': {
    id: '33333333-3333-4333-a333-333333333333',
    sevarthId: 'MH-JUD-00812',
    badgeNumber: 'PP-019',
    fullName: 'Meera Deshmukh',
    fullNameMarathi: 'मीरा देशमुख',
    policeRank: 'PUBLIC_PROSECUTOR',
    policeStation: 'City Civil & Sessions Court, Fort',
    policeZone: 'Sessions Division',
    clearanceLevel: 4,
  },
};

interface AuthContextType {
  officer: OfficerProfile | null;
  isAuthenticated: boolean;
  language: 'en' | 'mr';
  isLoading: boolean;
  error: ForensicsError | null;
  login: (sevarthId: string) => Promise<boolean>;
  logout: () => void;
  toggleLanguage: () => void;
  setLanguage: (lang: 'en' | 'mr') => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [officer, setOfficer] = useState<OfficerProfile | null>(null);
  const [language, setLanguage] = useState<'en' | 'mr'>('en');
  const { isLoading, error, loginWithPasskey, clearError } = useWebAuthn();

  useEffect(() => {
    // Recover persisted session if available
    const saved = localStorage.getItem('incorrupta_officer');
    const savedLang = localStorage.getItem('incorrupta_lang');
    if (saved) {
      try {
        setOfficer(JSON.parse(saved));
      } catch {
        localStorage.removeItem('incorrupta_officer');
      }
    }
    if (savedLang === 'en' || savedLang === 'mr') {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'mr' : 'en';
    setLanguage(nextLang);
    localStorage.setItem('incorrupta_lang', nextLang);
  };

  const updateLanguage = (lang: 'en' | 'mr') => {
    setLanguage(lang);
    localStorage.setItem('incorrupta_lang', lang);
  };

  const login = async (sevarthId: string): Promise<boolean> => {
    const success = await loginWithPasskey(sevarthId);
    if (success) {
      const normalizedId = sevarthId.trim().toUpperCase();
      const profile: OfficerProfile = SEEDED_OFFICERS[normalizedId] || {
        id: '99999999-9999-4999-a999-999999999999',
        sevarthId: normalizedId,
        badgeNumber: 'POL-AUTO',
        fullName: 'Investigating Officer',
        fullNameMarathi: 'तपास अधिकारी',
        policeRank: 'ASSISTANT_POLICE_INSPECTOR',
        policeStation: 'BKC Cyber Crime Police Station',
        policeZone: 'Zone VIII',
        clearanceLevel: 3,
      };

      setOfficer(profile);
      localStorage.setItem('incorrupta_officer', JSON.stringify(profile));
      return true;
    }
    return false;
  };

  const logout = () => {
    setOfficer(null);
    localStorage.removeItem('incorrupta_officer');
  };

  return (
    <AuthContext.Provider
      value={{
        officer,
        isAuthenticated: !!officer,
        language,
        isLoading,
        error,
        login,
        logout,
        toggleLanguage,
        setLanguage: updateLanguage,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
