import { Loader2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { capitalize } from '@/lib/utils';

import FlashcardExport from '@/components/FlashcardExport';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  fetchInflections,
  organizeInflectionTable,
} from '@/service/inflection';

import { Feature } from '@/types';
import { InflectionTableData } from '@/types/inflections';
import Token from '@/types/token';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  token: Token;
  languageCode: string;
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

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  token,
  languageCode,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inflectionTable, setInflectionTable] = useState<InflectionTableData>(
    {}
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInflections = async () => {
      if (!token) return;

      setIsLoading(true);
      setError(null);

      try {
        // todo: refactor with error handling
        const response = await fetchInflections({
          token,
          languageCode,
        });
        const inflectionTable = organizeInflectionTable(response);
        setInflectionTable(inflectionTable);
      } catch (err) {
        setError('Failed to load inflections');
        console.error('Error loading inflections:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadInflections();
    }
  }, [token, languageCode, isOpen]);

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

            <div className='space-y-3'>
              <h3 className='text-lg font-semibold'>Export</h3>
              <FlashcardExport token={token} />
            </div>
          </div>
          {/* Inflections Section */}
          <div className='space-y-3'>
            <h3 className='text-lg font-semibold'>Inflections</h3>

            {isLoading && (
              <div className='flex items-center justify-center py-4'>
                <Loader2 className='h-6 w-6 animate-spin text-gray-500' />
              </div>
            )}

            {error && (
              <div className='text-red-500 text-sm p-3 bg-red-50 rounded'>
                {error}
              </div>
            )}

            {!isLoading &&
              !error &&
              Object.keys(inflectionTable).length > 0 && (
                <div className='overflow-x-auto'>
                  <table className='w-full border-collapse'>
                    <thead>
                      <tr>
                        <th className='border px-4 py-2 bg-gray-50'>
                          {token.morphology.pos === 'VERB' ? 'Person' : 'Case'}
                        </th>
                        <th className='border px-4 py-2 bg-gray-50'>
                          Singular
                        </th>
                        <th className='border px-4 py-2 bg-gray-50'>Plural</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(inflectionTable).map(
                        ([caseValue, numbers]) => (
                          <tr key={caseValue}>
                            <td className='border px-4 py-2 font-medium'>
                              {capitalize(caseValue)}
                            </td>
                            <td className='border px-4 py-2'>
                              {numbers.singular}
                            </td>
                            <td className='border px-4 py-2'>
                              {numbers.plural}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;
