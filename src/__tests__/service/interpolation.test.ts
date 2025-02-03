import interpolateTokensWithText from '@/service/interpolation';

import { TokenMorphology, TokenTranslation } from '@/types';

interface Token {
  text: string;
  morphology: TokenMorphology;
  translation: TokenTranslation;
}

// Helper function to create tokens for testing
function createToken(text: string): Token {
  return {
    text,
    morphology: {} as TokenMorphology,
    translation: {} as TokenTranslation,
  };
}

describe('interpolateTokensWithText', () => {
  it('should handle basic text with punctuation', () => {
    const text = 'Hello, world!';
    const tokens = [createToken('Hello'), createToken('world')];

    const result = interpolateTokensWithText(text, tokens);

    expect(result).toHaveLength(4);
    expect(result[0].text).toBe('Hello');
    expect(result[1].text).toBe(',');
    expect(result[2].text).toBe('world');
    expect(result[3].text).toBe('!');
  });

  it('should handle multiple consecutive punctuation marks', () => {
    const text = 'Hello... world???';
    const tokens = [createToken('Hello'), createToken('world')];

    const result = interpolateTokensWithText(text, tokens);

    expect(result).toHaveLength(4);
    expect(result[0].text).toBe('Hello');
    expect(result[1].text).toBe('...');
    expect(result[2].text).toBe('world');
    expect(result[3].text).toBe('???');
  });

  it('should handle case-insensitive matching', () => {
    const text = 'HELLO, World!';
    const tokens = [createToken('hello'), createToken('world')];

    const result = interpolateTokensWithText(text, tokens);

    expect(result).toHaveLength(4);
    expect(result[0].text).toBe('hello');
    expect(result[1].text).toBe(',');
    expect(result[2].text).toBe('world');
    expect(result[3].text).toBe('!');
  });

  it('should handle extra whitespace', () => {
    const text = 'Hello,    world  !';
    const tokens = [createToken('Hello'), createToken('world')];

    const result = interpolateTokensWithText(text, tokens);

    expect(result).toHaveLength(4);
    expect(result[0].text).toBe('Hello');
    expect(result[1].text).toBe(',');
    expect(result[2].text).toBe('world');
    expect(result[3].text).toBe('!');
  });

  it('should handle empty input text', () => {
    const text = '';
    const tokens: Token[] = [];

    const result = interpolateTokensWithText(text, tokens);

    expect(result).toHaveLength(0);
  });

  it('should handle text with no punctuation', () => {
    const text = 'Hello world';
    const tokens = [createToken('Hello'), createToken('world')];

    const result = interpolateTokensWithText(text, tokens);

    expect(result).toHaveLength(2);
    expect(result[0].text).toBe('Hello');
    expect(result[1].text).toBe('world');
  });

  it('should handle text with punctuation at the beginning', () => {
    const text = '¡Hello world';
    const tokens = [createToken('Hello'), createToken('world')];

    const result = interpolateTokensWithText(text, tokens);

    expect(result).toHaveLength(3);
    expect(result[0].text).toBe('¡');
    expect(result[1].text).toBe('Hello');
    expect(result[2].text).toBe('world');
  });

  it('should handle special characters and symbols', () => {
    const text = 'Hello@world#how$are%you';
    const tokens = [
      createToken('Hello'),
      createToken('world'),
      createToken('how'),
      createToken('are'),
      createToken('you'),
    ];

    const result = interpolateTokensWithText(text, tokens);

    expect(result).toHaveLength(9);
    expect(result[1].text).toBe('@');
    expect(result[3].text).toBe('#');
    expect(result[5].text).toBe('$');
    expect(result[7].text).toBe('%');
  });

  it('should handle quotation marks and parentheses', () => {
    const text = '"Hello" (world)';
    const tokens = [createToken('Hello'), createToken('world')];

    const result = interpolateTokensWithText(text, tokens);

    expect(result).toHaveLength(5);
    expect(result[0].text).toBe('"');
    expect(result[1].text).toBe('Hello');
    expect(result[2].text).toBe('" (');
    expect(result[3].text).toBe('world');
    expect(result[4].text).toBe(')');
  });

  it('should handle empty token array with non-empty text', () => {
    const text = 'Hello, world!';
    const tokens: Token[] = [];

    const result = interpolateTokensWithText(text, tokens);

    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Hello, world!');
  });
});

describe('interpolateTokensWithText with unordered tokens', () => {
  const createToken = (text: string): Token => ({
    text,
    morphology: {} as TokenMorphology,
    translation: {} as TokenTranslation,
  });

  it('should handle unordered tokens correctly', () => {
    const text = 'Hello, world!';
    const tokens = [createToken('world'), createToken('Hello')];

    const result = interpolateTokensWithText(text, tokens);

    expect(result).toHaveLength(4);
    expect(result[0].text).toBe('Hello');
    expect(result[1].text).toBe(',');
    expect(result[2].text).toBe('world');
    expect(result[3].text).toBe('!');
  });

  it('should handle repeated words with unordered tokens', () => {
    const text = 'Hello hello world';
    const tokens = [
      createToken('world'),
      createToken('Hello'),
      createToken('hello'),
    ];

    const result = interpolateTokensWithText(text, tokens);

    expect(result).toHaveLength(3);
    expect(result[0].text.toLowerCase()).toBe('hello');
    expect(result[1].text.toLowerCase()).toBe('hello');
    expect(result[2].text).toBe('world');
  });

  it('should throw error for tokens not in text', () => {
    const text = 'Hello, world!';
    const tokens = [
      createToken('world'),
      createToken('Hello'),
      createToken('goodbye'),
    ];

    expect(() => interpolateTokensWithText(text, tokens)).toThrow(
      /Some tokens were not found/
    );
  });

  it('should handle completely reversed token order', () => {
    const text = 'One two three four';
    const tokens = [
      createToken('four'),
      createToken('three'),
      createToken('two'),
      createToken('One'),
    ];

    const result = interpolateTokensWithText(text, tokens);

    expect(result).toHaveLength(4);
    expect(result[0].text).toBe('One');
    expect(result[1].text).toBe('two');
    expect(result[2].text).toBe('three');
    expect(result[3].text).toBe('four');
  });
});
