export const kanaToHiragana = (input: string): string => {
    return input.split('').map(char => {
        const code = char.charCodeAt(0);
        // Katakana Unicode range: 0x30A0 - 0x30FF
        // Hiragana Unicode range: 0x3040 - 0x309F
        if (code >= 0x30A0 && code <= 0x30FF) {
            // Convert Katakana to Hiragana by subtracting the offset
            return String.fromCharCode(code - 0x60);
        }
        // If it's already Hiragana or not Kana, return the character as is
        return char;
    }).join('');
}

const kanjiRegex = /[\u4E00-\u9FAF]/;
export const containsKanji = (input: string): boolean => {
    return kanjiRegex.test(input);
};