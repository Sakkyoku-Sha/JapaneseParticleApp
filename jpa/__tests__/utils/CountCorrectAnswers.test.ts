import { JapaneseParticleParser } from "@/parsing/JapaneseParticleParser";
import { SplitTokensBySentences } from "@/parsing/KuromojiHelperFunctions";
import { CountCorrectAnswers } from "@/utils/CountCorrectAnswers";
import { IpadicFeatures } from "kuromoji";

describe("Count Correct Answers Tests", () => {

    beforeAll(async () => {
        await JapaneseParticleParser.Initialize();
    });

    it("MultiSentence All Marked Case", () => {

        const parsed = JapaneseParticleParser.parseJPText("私は猫です。犬のが嫌いです。毎日私は寝ます。");
        const sentences = SplitTokensBySentences(parsed);

        const markedSentences = [true, true, true];

        const getUserInputs = (sentenceIndex: number) => {
            if (sentenceIndex === 0) {
                return new Map<number, string>([[1, "は"]]); //Correct 
            }
            else if (sentenceIndex === 1) {
                return new Map<number, string>([[1, "には"]]); //Incorrect 
            }
            else{
                return new Map<number, string>(); //Not answered
            }
        };

        const correctAnswers = CountCorrectAnswers(sentences, markedSentences, getUserInputs);
        expect(correctAnswers).toBe(1);
    });

    it("MultiSentence MMix-Marked Case", () => {

        const parsed = JapaneseParticleParser.parseJPText("私は猫です。犬のが嫌いです。毎日私は寝ます。");
        const sentences = SplitTokensBySentences(parsed);

        const markedSentences = [true, false, false];

        const getUserInputs = (sentenceIndex: number) => {
            if (sentenceIndex === 0) {
                return new Map<number, string>([[1, "は"]]); //Correct 
            }
            else if (sentenceIndex === 1) {
                return new Map<number, string>([[1, "のが"]]); //Correct, but not marked 
            }
            else{
                return new Map<number, string>(); //Not answered
            }
        };

        const correctAnswers = CountCorrectAnswers(sentences, markedSentences, getUserInputs);
        expect(correctAnswers).toBe(1);
    });

    it("MultiSentence All Unmarked Case", () => {

        const parsed = JapaneseParticleParser.parseJPText("私は猫です。犬のが嫌いです。毎日私は寝ます。");
        const sentences = SplitTokensBySentences(parsed);

        const markedSentences = [false, false, false];

        const getUserInputs = (sentenceIndex: number) => {
            if (sentenceIndex === 0) {
                return new Map<number, string>([[1, "は"]]); //Correct 
            }
            else if (sentenceIndex === 1) {
                return new Map<number, string>([[1, "のが"]]); //Correct 
            }
            else{
                return new Map<number, string>(); //Not answered
            }
        };

        const correctAnswers = CountCorrectAnswers(sentences, markedSentences, getUserInputs);
        expect(correctAnswers).toBe(0);
    });

    it("Single Sentence Mixed Case", () => {

        const parsed = JapaneseParticleParser.parseJPText("私は猫であり、犬のが嫌くて、毎日私は寝ます。");
        const sentences = SplitTokensBySentences(parsed);

        const markedSentences = [true];

        const getUserInputs = (sentenceIndex: number) => {
            if (sentenceIndex === 0) {
                return new Map<number, string>([[1, "は"], [8, "が"]]);  
            }
            return new Map<number, string>();
        };

        const correctAnswers = CountCorrectAnswers(sentences, markedSentences, getUserInputs);
        expect(correctAnswers).toBe(2);
    });

});