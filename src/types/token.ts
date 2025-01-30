import { TokenMorphology, TokenTranslation } from '@/types/language';

export default interface Token {
  text: string;
  morphology: TokenMorphology;
  translation: TokenTranslation;
}
