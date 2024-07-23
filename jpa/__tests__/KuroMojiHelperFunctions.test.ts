import { IpadicFeatures } from "kuromoji";
import { IsTokenEndOfSentenceMarker, SplitTokensBySentences } from "../src/parsing/KuroMojiHelperFunctions";
import { JapaneseParticleParser } from "@/parsing/JapaneseParticleParser";

describe("IsTokenEndOfSentence", () => {

    it("Standard Expected Cases", () => {
       
        const fullWidthQuestionMark = "？";
        const fullWidthExclamationMArk = "！";
        const fullWidthPeriod = "。";
        const halfWidthQuestionMark = "?";
        const halfWidthExclamationMark = "!";
        const halfWidthPeriod = ".";

        expect(IsTokenEndOfSentenceMarker(ToTestToken(fullWidthQuestionMark))).toBe(true);
        expect(IsTokenEndOfSentenceMarker(ToTestToken(fullWidthExclamationMArk))).toBe(true);
        expect(IsTokenEndOfSentenceMarker(ToTestToken(fullWidthPeriod))).toBe(true);
        expect(IsTokenEndOfSentenceMarker(ToTestToken(halfWidthQuestionMark))).toBe(true);
        expect(IsTokenEndOfSentenceMarker(ToTestToken(halfWidthExclamationMark))).toBe(true);
        expect(IsTokenEndOfSentenceMarker(ToTestToken(halfWidthPeriod))).toBe(true);

        const notEndOfSentence = "ですか";
        expect(IsTokenEndOfSentenceMarker(ToTestToken(notEndOfSentence))).toBe(false);
    });

    function ToTestToken(token : string){
        return {surface_form: token} as IpadicFeatures;
    }

    it("Nested Quotations Splitting Text", async () => {

        const JapaeseText = "「これはライアンです！」と言います。";
        
        await JapaneseParticleParser.Initialize();
        const tokens = JapaneseParticleParser.parseJPText(JapaeseText);
        
        const tokenSplit = SplitTokensBySentences(tokens, 30);

        //Should not spliut on the ! 
        expect(tokenSplit.length).toBe(1);
    });

    it("NonStandard Nested Quotations Splitting Text", async () => {

        const JapaeseText = "『これはライアンです。』と言います。";
        
        await JapaneseParticleParser.Initialize();
        const tokens = JapaneseParticleParser.parseJPText(JapaeseText);
        
        const tokenSplit = SplitTokensBySentences(tokens, 30);

        //Should not spliut on the ! 
        expect(tokenSplit.length).toBe(1);
    });
    
    it("Splitting Text Standard Case", async () => {

        const JapaeseText = "これはライアンです。今日の天気がいいですね。";
        
        await JapaneseParticleParser.Initialize();
        const tokens = JapaneseParticleParser.parseJPText(JapaeseText);
        
        const tokenSplit = SplitTokensBySentences(tokens, 30);

        //Should not spliut on the ! 
        expect(tokenSplit.length).toBe(2);
        expect(tokenSplit[0][tokenSplit[0].length-1].surface_form).toBe("。");
        expect(tokenSplit[1][tokenSplit[1].length-1].surface_form).toBe("。");
    });

    it("Splitting Text on Exceeding Max Length", async () => {

        const JapaeseText = "これはライアンです, 今日の天気がいいですね.";
        
        await JapaneseParticleParser.Initialize();
        const tokens = JapaneseParticleParser.parseJPText(JapaeseText);
        
        const tokenSplit = SplitTokensBySentences(tokens, 10);

        //Should not spliut on the ! 
        expect(tokenSplit.length).toBe(2);
        expect(tokenSplit[1][tokenSplit[1].length-1].surface_form).toBe(".");
    });
});