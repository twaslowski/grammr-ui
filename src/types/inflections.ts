import { Feature } from '@/types/language';
import Token from '@/types/token';

export interface Inflection {
  lemma: string;
  inflected: string;
  features: Feature[];
}

export interface Inflections {
  lemma: string;
  inflections: Inflection[];
}

export interface InflectionsRequest {
  token: Token;
  languageCode: string;
}

export const fetchInflections = async (
  request: InflectionsRequest
): Promise<Inflections> => {
  try {
    const response = await fetch('/api/v1/inflection', {
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
