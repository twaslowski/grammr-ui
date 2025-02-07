'use client';

import { Info } from 'lucide-react';
import Head from 'next/head';
import React, { useState } from 'react';

import { buildApiUrl } from '@/lib/utils';

import Button from '@/components/buttons/Button';
import Sidebar from '@/components/Sidebar';
import Token from '@/components/Token';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import interpolateTokensWithText from '@/service/interpolation';

import Analysis from '@/types/analysis';

const HomePage = () => {
  // We manage the input text and API response state
  const [languageSpoken, setLanguageSpoken] = useState('en');
  const [languageLearned, setLanguageLearned] = useState('de');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [translationData, setTranslationData] = useState<Analysis | null>(null);
  const [activeTab, setActiveTab] = useState('aToB'); // State for active tab

  // Sidebar-related state in main component
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  const handleTokenShare = (token: Token) => {
    setSelectedToken(token);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedToken(null);
  };

  // This function handles the translation request to our API
  const handleTranslation = async (reversed: boolean) => {
    // First, we validate that the user has entered some text
    if (!inputText.trim()) {
      setError('Please enter some text to translate');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const endpoint = reversed ? 'translation' : 'analysis';
      const url = buildApiUrl(endpoint);
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

      // If the response isn't ok, we throw an error
      if (!response.ok) {
        throw new Error('Translation failed');
      }

      // We parse the JSON response and store it in our state
      const data: Analysis = await response.json();
      console.log(data);
      data.analyzedTokens = interpolateTokensWithText(
        data.semanticTranslation.translatedPhrase,
        data.analyzedTokens
      );
      setTranslationData(data);
      console.log(data);
    } catch (err) {
      console.error(err);
      setError('Failed to get translation. Please try again.');
    } finally {
      // Whether successful or not, we're no longer loading
      setIsLoading(false);
    }
  };

  return (
    <main className='min-h-screen bg-gray-50'>
      <Head>
        <title>grammr</title>
      </Head>

      {selectedToken && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => handleCloseSidebar()}
          token={selectedToken}
          languageCode={languageLearned}
        />
      )}

      <div className='container mx-auto px-4 py-8'>
        <Card className='w-full max-w-2xl mx-auto'>
          <CardHeader>
            <CardTitle className='text-2xl font-bold text-center'>
              grammr
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Input Section */}
            <div className='space-y-4'>
              {/* Language Selection */}
              <div className='flex items-center space-x-4'>
                <label htmlFor='languageSpoken' className='font-medium'>
                  I speak:
                </label>
                <select
                  id='languageSpoken'
                  value={languageSpoken}
                  onChange={(e) => setLanguageSpoken(e.target.value)}
                  className='p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48'
                >
                  <option value='en'>English</option>
                  <option value='de'>German</option>
                  <option value='ru'>Russian</option>
                </select>

                <label htmlFor='languageLearned' className='font-medium'>
                  and am learning:
                </label>
                <select
                  id='languageLearned'
                  value={languageLearned}
                  onChange={(e) => setLanguageLearned(e.target.value)}
                  className='p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48'
                >
                  <option value='en'>English</option>
                  <option value='de'>German</option>
                  <option value='ru'>Russian</option>
                </select>
              </div>
              {/* Tab Navigation */}
              <div className='flex space-x-4 mb-6 border-b border-gray-200'>
                <button
                  onClick={() => setActiveTab('aToB')}
                  className={`pb-2 px-4 ${
                    activeTab === 'aToB'
                      ? 'border-b-2 border-blue-500 text-blue-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Translate & Learn
                  <div className='group inline-block ml-2'>
                    <Info className='w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer' />
                    <div className='absolute hidden group-hover:block bg-white border border-gray-200 p-2 rounded-lg shadow-lg text-sm text-gray-600 w-64 z-10'>
                      Enter text in your native language to translate it into
                      the language you're learning and get a detailed
                      grammatical analysis.
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('bToA')}
                  className={`pb-2 px-4 ${
                    activeTab === 'bToA'
                      ? 'border-b-2 border-blue-500 text-blue-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Refine
                  <div className='group inline-block ml-2'>
                    <Info className='w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer' />
                    <div className='absolute hidden group-hover:block bg-white border border-gray-200 p-2 rounded-lg shadow-lg text-sm text-gray-600 w-64 z-10'>
                      Enter a text in the language you're learning to get a
                      detailed grammatical analysis.
                    </div>
                  </div>
                </button>
              </div>

              {/* Text Input */}
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className='w-full p-4 min-h-[100px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder={
                  activeTab === 'aToB'
                    ? 'Enter a text in the language you are speaking...'
                    : 'Enter a text in the language you would like to learn...'
                }
              />

              {/* Translate Button */}
              <Button
                onClick={
                  activeTab === 'aToB'
                    ? () => handleTranslation(true)
                    : () => handleTranslation(false)
                }
                disabled={isLoading}
                className='w-full'
              >
                {isLoading
                  ? 'Translating...'
                  : activeTab === 'aToB'
                  ? 'Translate & Analyze'
                  : 'Analyze'}
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
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>
                      {activeTab === 'aToB' ? 'Translation' : 'Analysis'}
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

export default HomePage;
