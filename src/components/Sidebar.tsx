import { X } from 'lucide-react';
import React from 'react';

import { capitalize } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Feature } from '@/types';
import Token from '@/types/token';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  token: Token;
}

function stringifyFeatures(features: Feature[]) {
  return features
    .filter((feature: Feature) => feature.type !== 'MISC')
    .map((feature: Feature) => (
      <p key={feature.type} className='text-sm'>
        {capitalize(feature.type)}: {capitalize(feature.fullIdentifier)}
      </p>
    ));
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, token }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-50 overflow-y-auto'>
      <Card className='h-full'>
        <CardHeader className='flex flex-row items-center justify-between border-b'>
          <CardTitle>Word Details</CardTitle>
          <Button variant='ghost' size='icon' onClick={onClose}>
            <X className='h-5 w-5' />
          </Button>
        </CardHeader>
        <CardContent className='p-6 space-y-4'>
          <div className='space-y-2'>
            <p className='text-2xl font-bold'>{token.text}</p>
            <p className='text-lg text-gray-600'>
              {capitalize(token.morphology.pos)}; base form:{' '}
              {token.morphology.lemma}
            </p>
            <p className='text-base'>
              Translation: {token.translation.translation}
            </p>
            <div className='bg-gray-50 p-3 rounded-lg'>
              {stringifyFeatures(token.morphology.features)}
              <p className='text-sm text-gray-700'></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;
