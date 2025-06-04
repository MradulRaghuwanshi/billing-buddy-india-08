
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 
  | 'english'
  | 'hindi'
  | 'bengali'
  | 'marathi'
  | 'telugu'
  | 'tamil'
  | 'gujarati'
  | 'urdu'
  | 'kannada'
  | 'odia'
  | 'malayalam'
  | 'punjabi'
  | 'assamese'
  | 'maithili'
  | 'santali'
  | 'kashmiri'
  | 'nepali'
  | 'sindhi'
  | 'dogri'
  | 'manipuri'
  | 'bodo';

export const languages = [
  { code: 'english', name: 'English', nativeName: 'English' },
  { code: 'hindi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'bengali', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'marathi', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'telugu', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'tamil', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gujarati', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'urdu', name: 'Urdu', nativeName: 'اردو' },
  { code: 'kannada', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'odia', name: 'Odia (Oriya)', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'malayalam', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'punjabi', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'assamese', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'maithili', name: 'Maithili', nativeName: 'मैथिली' },
  { code: 'santali', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'kashmiri', name: 'Kashmiri', nativeName: 'कॉशुर' },
  { code: 'nepali', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'sindhi', name: 'Sindhi', nativeName: 'سنڌي' },
  { code: 'dogri', name: 'Dogri', nativeName: 'डोगरी' },
  { code: 'manipuri', name: 'Manipuri (Meitei)', nativeName: 'মৈতৈলোন্' },
  { code: 'bodo', name: 'Bodo', nativeName: 'बर\'/बड़ो' },
] as const;

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  getLanguageDisplayName: (code: Language) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('english');

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('selectedLanguage', language);
  };

  const getLanguageDisplayName = (code: Language) => {
    const language = languages.find(lang => lang.code === code);
    return language ? `${language.name} (${language.nativeName})` : code;
  };

  // Load saved language on mount
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') as Language;
    if (savedLanguage && languages.some(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, getLanguageDisplayName }}>
      {children}
    </LanguageContext.Provider>
  );
};
