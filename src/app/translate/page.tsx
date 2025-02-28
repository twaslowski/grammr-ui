'use client';

import { Info } from 'lucide-react';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import Button from '@/components/buttons/Button';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Token from '@/components/Token';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import interpolateTokensWithText from '@/service/interpolation';

import Analysis from '@/types/analysis';

const TranslatePage = () => {
  // State declarations for translation functionality
  const [languageSpoken, setLanguageSpoken] = useState('en');
  const [languageLearned, setLanguageLearned] = useState('de');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [translationData, setTranslationData] = useState<Analysis | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  useEffect(() => {
    const storedLanguageSpoken = localStorage.getItem('languageSpoken');
    const storedLanguageLearned = localStorage.getItem('languageLearned');
    if (storedLanguageSpoken) {
      setLanguageSpoken(storedLanguageSpoken);
    }
    if (storedLanguageLearned) {
      setLanguageLearned(storedLanguageLearned);
    }
  }, []);

  const handleTokenShare = (token: Token) => {
    setSelectedToken(token);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedToken(null);
  };

  const handleLanguageChange = (spoken: string, learned: string) => {
    setLanguageSpoken(spoken);
    setLanguageLearned(learned);
  };

  const handleTranslation = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to translate');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const url = '/api/v1/translation';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phrase: inputText,
          userLanguageSpoken: languageSpoken,
          userLanguageLearned: languageLearned,
          performSemanticTranslation: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data: Analysis = await response.json();
      data.analyzedTokens = interpolateTokensWithText(
        data.semanticTranslation.translatedPhrase,
        data.analyzedTokens
      );
      setTranslationData(data);
    } catch (err) {
      console.error(err);
      setError('Failed to get translation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <Head>
        <title>grammr - Translate & Learn</title>
      </Head>

      <Header
        initialLanguageSpoken={languageSpoken}
        initialLanguageLearned={languageLearned}
        onLanguageChange={handleLanguageChange}
      />

      {selectedToken && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => handleCloseSidebar()}
          token={selectedToken}
          languageCode={languageLearned}
        />
      )}

      <div className='container mx-auto px-4 py-8'>
        <Card className='w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-md'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              Translate & Learn
              <div className='group inline-block ml-2'>
                <Info className='w-4 h-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 cursor-pointer' />
                <div className='absolute hidden group-hover:block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded-lg shadow-lg text-sm text-gray-600 dark:text-gray-300 w-64 z-10'>
                  Enter text in your native language to translate it into the
                  language you're learning and get a detailed grammatical
                  analysis.
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Input Section */}
            <div className='space-y-4'>
              {/* Text Input */}
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className='w-full p-4 min-h-[100px] border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                placeholder={`Enter a text in ${getLanguageName(
                  languageSpoken
                )}...`}
              />

              {/* Translate Button */}
              <Button
                onClick={handleTranslation}
                disabled={isLoading}
                className='w-full bg-primary-600 hover:bg-primary-700 text-white'
              >
                {isLoading ? 'Translating...' : 'Translate & Analyze'}
              </Button>

              {/* Error Message */}
              {error && (
                <Alert variant='destructive'>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Results Section */}
            {translationData && (
              <div className='mt-8 space-y-6'>
                <Card className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <CardHeader>
                    <CardTitle className='text-lg text-gray-900 dark:text-gray-100'>
                      Translation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='flex flex-wrap gap-2'>
                      {translationData.analyzedTokens.map((token) => (
                        <Token
                          key={token.text}
                          text={token.text}
                          morphology={token.morphology}
                          translation={token.translation}
                          onShare={() => handleTokenShare(token)}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

// Helper function to get language name from code
const getLanguageName = (code: string): string => {
  const languageMap: { [key: string]: string } = {
    en: 'English',
    de: 'German',
    ru: 'Russian',
    fr: 'French',
    es: 'Spanish',
    it: 'Italian',
    ja: 'Japanese',
    zh: 'Chinese',
  };
  return languageMap[code] || code;
};

export default TranslatePage;
