import { JapaneseParticleParser } from "@/parsing/JapaneseParticleParser";
import { CountCorrectAnswers } from "@/utils/CountCorrectAnswers";
import { use } from "marked";

describe("Count Correct Answers Tests", () => {

    beforeAll(async () => {
        await JapaneseParticleParser.Initialize();
    });

    it("Empty User Inputs", () => {
        const sentence = JapaneseParticleParser.parseJPText("これはライアンです");
        const userInputs = new Map<number, string>();

        const result = CountCorrectAnswers(sentence, userInputs);
        expect(result).toBe(0);
    });

    it("Single Correct Answer", () => {
        const sentence = JapaneseParticleParser.parseJPText("彼は嬉しいと思います");
        const userInputs = new Map<number, string>();
        userInputs.set(1, "は");
        userInputs.set(3, "");

        const result = CountCorrectAnswers(sentence, userInputs);
        expect(result).toBe(1);
    });
});