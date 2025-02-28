'use client';

import { ArrowRight, Edit, Languages } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const HomePage = () => {
  const [languageSpoken, setLanguageSpoken] = useState('en');
  const [languageLearned, setLanguageLearned] = useState('de');

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

  const handleLanguageChange = (spoken: string, learned: string) => {
    setLanguageSpoken(spoken);
    setLanguageLearned(learned);
    localStorage.setItem('languageSpoken', spoken);
    localStorage.setItem('languageLearned', learned);
  };

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col'>
      <Head>
        <title>grammr - Language Learning</title>
      </Head>

      <Header
        initialLanguageSpoken={languageSpoken}
        initialLanguageLearned={languageLearned}
        onLanguageChange={handleLanguageChange}
      />

      <div className='container mx-auto px-4 py-12 flex-grow'>
        <div className='max-w-4xl mx-auto text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
            grammr
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-300'>
            Your toolkit for decoding grammar and vocabulary
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
          {/* Translate & Learn Card */}
          <Link href='/translate' passHref>
            <Card className='bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full'>
              <CardHeader>
                <CardTitle className='flex items-center text-xl text-primary-600 dark:text-primary-400'>
                  <Languages className='mr-2 h-6 w-6' />
                  Translate & Learn
                </CardTitle>
                <CardDescription className='text-gray-600 dark:text-gray-400'>
                  Translate sentences, analyze grammar and vocabulary, and save
                  key words as flashcards to boost your language learning.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-gray-700 dark:text-gray-300 mb-4'>
                  Enter text in your native language and get a detailed
                  translation with grammatical analysis.
                </p>
                <div className='flex justify-end'>
                  <span className='text-primary-600 dark:text-primary-400 inline-flex items-center'>
                    Get started <ArrowRight className='ml-2 h-4 w-4' />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Refine Card */}
          <Card className='bg-white dark:bg-gray-800 shadow-md h-full border border-gray-200 dark:border-gray-700'>
            <CardHeader>
              <CardTitle className='flex items-center text-xl text-gray-400 dark:text-gray-500'>
                <Edit className='mr-2 h-6 w-6' />
                Refine (Coming Soon)
              </CardTitle>
              <CardDescription className='text-gray-500 dark:text-gray-400'>
                Analyze and improve your writing skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-gray-500 dark:text-gray-400 mb-4'>
                Enter text in the language you're learning to get detailed
                grammatical analysis, error detection and suggestions.
              </p>
              <div className='flex justify-end'>
                <span className='text-gray-400 dark:text-gray-500 inline-flex items-center'>
                  Coming soon <ArrowRight className='ml-2 h-4 w-4' />
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default HomePage;
