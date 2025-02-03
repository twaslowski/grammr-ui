import { X } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  token: {
    text: string;
    translation: { translation: string };
    morphology: {
      pos: string;
      lemma: string;
      features: Record<string, string>;
    };
  };
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, token }) => {
  if (!isOpen) return null;

  const stringifyFeatures = (features: Record<string, string>) => {
    return Object.entries(features)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

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
              {capitalize(token.morphology.pos)}
            </p>
            <p className='text-base'>
              Translation: {token.translation.translation}
            </p>
            {token.text.toLowerCase() !==
              token.morphology.lemma.toLowerCase() && (
              <p className='text-sm text-gray-500'>
                Base form: {token.morphology.lemma}
              </p>
            )}
            <div className='bg-gray-50 p-3 rounded-lg'>
              <p className='text-sm text-gray-700'>
                {stringifyFeatures(token.morphology.features)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;
