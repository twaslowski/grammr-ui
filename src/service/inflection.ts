import { backendHost } from '@/constant/env';

import { Feature } from '@/types';
import {
  Inflection,
  Inflections,
  InflectionsRequest,
  InflectionTableData,
} from '@/types/inflections';

export const organizeInflectionTable = (
  inflections: Inflections
): InflectionTableData => {
  if (
    inflections.partOfSpeech === 'NOUN' ||
    inflections.partOfSpeech === 'ADJ'
  ) {
    return organizeNounInflectionTable(inflections.inflections);
  } else {
    return organizeVerbInflectionTable(inflections.inflections);
  }
};

const organizeNounInflectionTable = (
  inflections: Inflection[]
): InflectionTableData => {
  const table: InflectionTableData = {};

  const features = ['NOM', 'GEN', 'DAT', 'ACC', 'ABL', 'LOC'];
  features.forEach((feature) => {
    table[feature] = {
      singular:
        findInflection(inflections, [
          { type: 'CASE', value: feature, fullIdentifier: '' },
          {
            type: 'NUMBER',
            value: 'SING',
            fullIdentifier: '',
          },
        ])?.inflected || '',
      plural:
        findInflection(inflections, [
          { type: 'CASE', value: feature, fullIdentifier: '' },
          {
            type: 'NUMBER',
            value: 'PLUR',
            fullIdentifier: '',
          },
        ])?.inflected || '',
    };
  });

  // remove all entries where both singular and plural are empty
  Object.keys(table).forEach((key) => {
    if (!table[key].singular && !table[key].plural) {
      delete table[key];
    }
  });
  return table;
};

const organizeVerbInflectionTable = (
  inflections: Inflection[]
): InflectionTableData => {
  const table: InflectionTableData = {};

  const type = 'PERSON';
  const features = ['FIRST', 'SECOND', 'THIRD'];
  features.forEach((feature) => {
    table[feature] = {
      singular:
        findInflection(inflections, [
          { type: type, value: feature, fullIdentifier: '' },
          {
            type: 'NUMBER',
            value: 'SING',
            fullIdentifier: '',
          },
        ])?.inflected || '',
      plural:
        findInflection(inflections, [
          { type: type, value: feature, fullIdentifier: '' },
          {
            type: 'NUMBER',
            value: 'PLUR',
            fullIdentifier: '',
          },
        ])?.inflected || '',
    };
  });

  // remove all entries where both singular and plural are empty
  Object.keys(table).forEach((key) => {
    if (!table[key].singular && !table[key].plural) {
      delete table[key];
    }
  });
  return table;
};

export const findInflection = (
  inflections: Inflection[],
  features: Feature[]
): Inflection | undefined => {
  console.log(inflections);
  return inflections.find((inflection) => {
    return features.every((feature) =>
      inflection.features.some(
        (f) => f.value === feature.value && f.type === feature.type
      )
    );
  });
};

export const fetchInflections = async (
  request: InflectionsRequest
): Promise<Inflections> => {
  try {
    const response = await fetch(`${backendHost}/api/v1/inflection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as Inflections;
  } catch (error) {
    console.error('Error fetching inflections:', error);
    throw error;
  }
};
