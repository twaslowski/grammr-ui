import React from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { Feature } from '@/types';
import Token from '@/types/token';

const Token: React.FC<Token> = ({ text, translation, morphology }) => {
  const getPosColor = (pos: string): string => {
    const posColors: { [key: string]: string } = {
      NOUN: 'bg-blue-100 hover:bg-blue-200',
      VERB: 'bg-green-100 hover:bg-green-200',
      ADJ: 'bg-purple-100 hover:bg-purple-200',
      ADV: 'bg-yellow-100 hover:bg-yellow-200',
      PRON: 'bg-pink-100 hover:bg-pink-200',
      DET: 'bg-gray-100 hover:bg-gray-200',
      PREP: 'bg-orange-100 hover:bg-orange-200',
      CONJ: 'bg-red-100 hover:bg-red-200',
    };

    return posColors[pos.toUpperCase()] || 'bg-gray-100 hover:bg-gray-200';
  };

  const capitalize = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };

  const stringifyFeatures = (features: Feature[]): string => {
    return features
      .map((f) => `${capitalize(f.type)}: ${capitalize(f.value)}`)
      .join(', ');
  };

  return (
    <Popover>
      <PopoverTrigger>
        <span>
          <div className={`text-lg ${getPosColor(morphology.pos)}`}>{text}</div>
        </span>
      </PopoverTrigger>

      <PopoverContent className='w-64'>
        <div className='space-y-2'>
          {/* Word and Translation Section */}
          <div className='border-b pb-2'>
            <p className='font-semibold'>{text}</p>
            <p className='font-normal'>{capitalize(morphology.pos)}</p>
            <p className='text-sm text-gray-600'>
              Translation: {translation.translation}
            </p>
            {text.toLowerCase() !== morphology.lemma.toLowerCase() && (
              <p className='text-sm text-gray-600'>
                From: {morphology.lemma};{' '}
                {stringifyFeatures(morphology.features)}
              </p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Token;
