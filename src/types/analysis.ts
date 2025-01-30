import { SemanticTranslation } from '@/types/language';
import Token from '@/types/token';

export default interface Analysis {
  sourcePhrase: string;
  semanticTranslation: SemanticTranslation;
  analyzedTokens: Token[];
}
