import { TokenMorphology, TokenTranslation } from '@/types';
import Token from '@/types/token';

interface TokenMatch {
  token: Token;
  startIndex: number;
  endIndex: number;
}

export default function interpolateTokensWithText(
  originalText: string,
  tokens: Token[]
): Token[] {
  const lowerText = originalText.toLowerCase();
  const result: Token[] = [];

  // First, find all possible positions for each token
  const allMatches: TokenMatch[] = [];

  // Find all occurrences of each token in the text
  tokens.forEach((token) => {
    const tokenText = token.text.toLowerCase();
    let pos = 0;

    while (pos < lowerText.length) {
      const index = lowerText.indexOf(tokenText, pos);
      if (index === -1) break;

      allMatches.push({
        token,
        startIndex: index,
        endIndex: index + tokenText.length,
      });

      pos = index + 1;
    }
  });

  // Sort matches by position
  allMatches.sort((a, b) => a.startIndex - b.startIndex);

  // Remove overlapping matches, keeping the best ones
  const validMatches: TokenMatch[] = [];
  let lastEnd = 0;

  allMatches.forEach((match) => {
    if (match.startIndex >= lastEnd) {
      validMatches.push(match);
      lastEnd = match.endIndex;
    }
  });

  // Now process the text with valid matches
  let currentPosition = 0;

  for (let i = 0; i < validMatches.length; i++) {
    const match = validMatches[i];

    // Add any punctuation before the token
    if (match.startIndex > currentPosition) {
      const punctuation = originalText
        .slice(currentPosition, match.startIndex)
        .trim();
      if (punctuation) {
        result.push({
          text: punctuation,
          morphology: {} as TokenMorphology,
          translation: {} as TokenTranslation,
        });
      }
    }

    // Add the token
    result.push(match.token);
    currentPosition = match.endIndex;
  }

  // Add any remaining text as punctuation
  if (currentPosition < originalText.length) {
    const remaining = originalText.slice(currentPosition).trim();
    if (remaining) {
      result.push({
        text: remaining,
        morphology: {} as TokenMorphology,
        translation: {} as TokenTranslation,
      });
    }
  }

  // Verify all tokens were used
  const usedTokens = new Set(validMatches.map((match) => match.token));
  const unusedTokens = tokens.filter(
    (token) =>
      !Array.from(usedTokens).some(
        (usedToken) => usedToken.text.toLowerCase() === token.text.toLowerCase()
      )
  );

  if (unusedTokens.length > 0) {
    throw new Error(
      `Some tokens were not found in the text: ${unusedTokens
        .map((t) => t.text)
        .join(', ')}`
    );
  }

  return result;
}
