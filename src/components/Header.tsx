'use client';

import { ChevronDown, Menu, X } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserMenu from '@/components/UserMenu';

// Language data with ISO codes and display names
const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
];

interface HeaderProps {
  initialLanguageSpoken?: string;
  initialLanguageLearned?: string;
  onLanguageChange?: (spoken: string, learned: string) => void;
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({
  initialLanguageSpoken = 'en',
  initialLanguageLearned = 'de',
  onLanguageChange,
}) => {
  // State for mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // State for language preferences
  const [languageSpoken, setLanguageSpoken] = useState(initialLanguageSpoken);
  const [languageLearned, setLanguageLearned] = useState(
    initialLanguageLearned
  );

  // Load saved language preferences on component mount
  useEffect(() => {
    const savedSpoken = localStorage.getItem('languageSpoken');
    const savedLearned = localStorage.getItem('languageLearned');

    if (savedSpoken) setLanguageSpoken(savedSpoken);
    if (savedLearned) setLanguageLearned(savedLearned);
  }, []);

  // Update localStorage and notify parent when language changes
  const updateLanguages = (spoken: string, learned: string) => {
    setLanguageSpoken(spoken);
    setLanguageLearned(learned);

    localStorage.setItem('languageSpoken', spoken);
    localStorage.setItem('languageLearned', learned);

    if (onLanguageChange) {
      onLanguageChange(spoken, learned);
    }
  };

  // Helper function to get language details by code
  const getLanguageByCode = (code: string) => {
    return languages.find((lang) => lang.code === code) || languages[0];
  };

  // Get current language objects
  const spokenLanguage = getLanguageByCode(languageSpoken);
  const learnedLanguage = getLanguageByCode(languageLearned);

  return (
    <header className='bg-white shadow-sm'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo and Brand */}
          <div className='flex items-center'>
            <Link href='/' className='flex items-start'>
              <span className='text-xl font-bold text-primary-600'>grammr</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex space-x-8'>
            <Link
              href='/'
              className='text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium'
            >
              Home
            </Link>
            <Link
              href='/practice'
              className='text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium'
            >
              Practice
            </Link>
            <Link
              href='/flashcards'
              className='text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium'
            >
              Flashcards
            </Link>
            <Link
              href='/about'
              className='text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium'
            >
              About
            </Link>
          </nav>

          {/* Right side with language selector and user menu */}
          <div className='hidden md:flex items-center space-x-4'>
            {/* Language Selector Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className='inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'>
                <span className='mr-1'>{spokenLanguage.flag}</span>
                <span className='mx-1'>→</span>
                <span className='mr-1'>{learnedLanguage.flag}</span>
                <ChevronDown className='ml-1 w-4 h-4' />
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-64 p-4'>
                <div className='mb-4'>
                  <p className='text-sm font-medium text-gray-700 mb-2'>
                    I speak:
                  </p>
                  <div className='grid grid-cols-2 gap-2'>
                    {languages.map((lang) => (
                      <button
                        key={`speak-${lang.code}`}
                        className={`flex items-center px-2 py-1 text-sm rounded-md ${
                          languageSpoken === lang.code
                            ? 'bg-blue-100 text-blue-700'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() =>
                          updateLanguages(lang.code, languageLearned)
                        }
                      >
                        <span className='mr-2'>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-700 mb-2'>
                    I am learning:
                  </p>
                  <div className='grid grid-cols-2 gap-2'>
                    {languages.map((lang) => (
                      <button
                        key={`learn-${lang.code}`}
                        className={`flex items-center px-2 py-1 text-sm rounded-md ${
                          languageLearned === lang.code
                            ? 'bg-blue-100 text-blue-700'
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() =>
                          updateLanguages(languageSpoken, lang.code)
                        }
                      >
                        <span className='mr-2'>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <UserMenu />
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden flex items-center'>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500'
            >
              <span className='sr-only'>
                {isMenuOpen ? 'Close main menu' : 'Open main menu'}
              </span>
              {isMenuOpen ? (
                <X className='block h-6 w-6' aria-hidden='true' />
              ) : (
                <Menu className='block h-6 w-6' aria-hidden='true' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className='md:hidden'>
          <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
            <Link
              href='/'
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            >
              Home
            </Link>
            <Link
              href='/practice'
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            >
              Practice
            </Link>
            <Link
              href='/flashcards'
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            >
              Flashcards
            </Link>
            <Link
              href='/about'
              className='block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            >
              About
            </Link>
          </div>

          {/* Mobile language selector */}
          <div className='pt-4 pb-3 border-t border-gray-200'>
            <div className='px-4'>
              <p className='text-sm font-medium text-gray-500'>
                Language Settings
              </p>
              <div className='mt-2 flex items-center'>
                <div className='flex-1'>
                  <p className='text-sm text-gray-700'>I speak:</p>
                  <select
                    value={languageSpoken}
                    onChange={(e) =>
                      updateLanguages(e.target.value, languageLearned)
                    }
                    className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                  >
                    {languages.map((lang) => (
                      <option
                        key={`mobile-speak-${lang.code}`}
                        value={lang.code}
                      >
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='mt-2 flex items-center'>
                <div className='flex-1'>
                  <p className='text-sm text-gray-700'>I am learning:</p>
                  <select
                    value={languageLearned}
                    onChange={(e) =>
                      updateLanguages(languageSpoken, e.target.value)
                    }
                    className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                  >
                    {languages.map((lang) => (
                      <option
                        key={`mobile-learn-${lang.code}`}
                        value={lang.code}
                      >
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <UserMenu />
        </div>
      )}
    </header>
  );
};

export default Header;
