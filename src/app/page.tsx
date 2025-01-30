'use client';

import Head from 'next/head';
import React, { useState } from 'react';

import Button from '@/components/buttons/Button';
import Token from '@/components/Token';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import Analysis from '@/types/analysis';

const HomePage = () => {
  // We manage the input text and API response state
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [translationData, setTranslationData] = useState<Analysis | null>(null);

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
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
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
              Translation Tool
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Input Section */}
            <div className='space-y-4'>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className='w-full p-4 min-h-[100px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter text here...'
              />

              <Button
                onClick={handleTranslation}
                disabled={isLoading}
                className='w-full'
              >
                {isLoading ? 'Translating...' : 'Translate'}
              </Button>

              {error && (
                <Alert variant='destructive'>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Results Section - Now using our Token component */}
            {translationData && (
              <div className='mt-8 space-y-6'>
                {/* Original Translation */}
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>Translation</CardTitle>
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
