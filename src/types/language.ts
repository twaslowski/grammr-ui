export interface SemanticTranslation {
  sourcePhrase: string;
  translatedPhrase: string;
}

export interface LiteralTranslation {
  sourcePhrase: string;
  tokenTranslations: TokenTranslation[];
}

export interface TokenTranslation {
  source: string;
  translation: string;
}

export interface Morphology {
  sourcePhrase: string;
  tokenMorphology: string;
}

export interface TokenMorphology {
  text: string;
  lemma: string;
  pos: string; // todo introduce enum
  features: Feature[]; // todo introduce enum

  stringify_features(): string;
}

export interface Feature {
  type: string;
  value: string;
  fullIdentifier: string;
}
