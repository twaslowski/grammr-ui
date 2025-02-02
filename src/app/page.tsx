'use client';

import Head from 'next/head';
import React, { useState } from 'react';

import Button from '@/components/buttons/Button';
import Token from '@/components/Token';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { backendHost } from '@/constant/env';

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

  // This function handles the translation request to our API
  const handleTranslation = async () => {
    // First, we validate that the user has entered some text
    if (!inputText.trim()) {
      setError('Please enter some text to translate');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${backendHost}/api/v1/analysis`, {
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
      const data = await response.json();
      setTranslationData(data);
    } catch (err) {
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

      <div className='container mx-auto px-4 py-8'>
        <Card className='w-full max-w-2xl mx-auto'>
          <CardHeader>
            <CardTitle className='text-2xl font-bold text-center'>
              grammr
            </CardTitle>
          </CardHeader>
          <CardContent>
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
              </button>
            </div>

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
                onClick={handleTranslation}
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
                    <p className='text-lg'>{translationData.sourcePhrase}</p>
                    <div className='flex flex-wrap gap-2'>
                      {translationData.analyzedTokens.map((token) => (
                        <Token
                          key={token.text}
                          text={token.text}
                          morphology={token.morphology}
                          translation={token.translation}
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
