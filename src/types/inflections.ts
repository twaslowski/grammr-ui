import { Feature } from '@/types/language';
import Token from '@/types/token';

export interface Inflection {
  lemma: string;
  inflected: string;
  features: Feature[];
}

export interface Inflections {
  lemma: string;
  partOfSpeech: string;
  inflections: Inflection[];
}

export interface InflectionsRequest {
  token: Token;
  languageCode: string;
}

export interface InflectionTableData {
  [key: string]: {
    singular: string;
    plural: string;
  };
}
