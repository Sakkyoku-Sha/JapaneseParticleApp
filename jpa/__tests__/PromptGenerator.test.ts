
import { GeneratePromptFromWrongAnswer } from '@/LLM/PromptGenerator';
import fs from 'fs';

describe('GeneratePromptFromWrongAnswer', () => {
  it('should generate the correct prompt', () => {
    const guess = 'が';
    const correctAnswer = 'は';
    const guessIndex = 1;
    const allDisplayedStrings = ['これ', 'は', 'ライアン', 'です'];
    const fullContext = '毎日、その男はこれはライアンですと言います';
  
    const expected = fs.readFileSync('__tests__/PromptGeneratorTestExpected.txt').toString();
    const result = GeneratePromptFromWrongAnswer(guess, correctAnswer, guessIndex, allDisplayedStrings, fullContext);

    expect(result).toEqual(expected);
  });
});