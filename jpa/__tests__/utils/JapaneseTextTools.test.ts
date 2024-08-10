import { kanaToHiragana } from '@/utils/JapaneseTextTools';

describe('toHiragana', () => {
    test('should convert all katakana characters to hiragana', () => {
        const input = 'カタカナ';
        const expected = 'かたかな';
        const result = kanaToHiragana(input);
        expect(result).toBe(expected);
    });

    test('should convert mixed katakana and hiragana characters to hiragana', () => {
        const input = 'カタカナ ひらがな';
        const expected = 'かたかな ひらがな';
        const result = kanaToHiragana(input);
        expect(result).toBe(expected);
    });

    test('should not convert non-katakana characters', () => {
        const input = 'カタカナ ひらがな 123';
        const expected = 'かたかな ひらがな 123';
        const result = kanaToHiragana(input);
        expect(result).toBe(expected);
    });

    test('should handle empty string', () => {
        const input = '';
        const expected = '';
        const result = kanaToHiragana(input);
        expect(result).toBe(expected);
    });
});