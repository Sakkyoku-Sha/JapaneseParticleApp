import { IpadicFeatures } from "kuromoji";
import { CountParticles, CountParticlesInSentences, IsParticle, IsTokenEndOfSentenceMarker, SplitTokensBySentences } from "../src/parsing/KuromojiHelperFunctions";
import { JapaneseParticleParser } from "@/parsing/JapaneseParticleParser";
import fs from "fs";

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

        const JapaneseText = "「これはライアンです！」と言います。";
        
        await JapaneseParticleParser.Initialize();
        const tokens = JapaneseParticleParser.parseJPText(JapaneseText);
        
        const tokenSplit = SplitTokensBySentences(tokens, 30);

        //Should not spliut on the ! 
        expect(tokenSplit.length).toBe(1);
    });

    it("NonStandard Nested Quotations Splitting Text", async () => {

        const JapaneseText = "『これはライアンです。』と言います。";
        
        await JapaneseParticleParser.Initialize();
        const tokens = JapaneseParticleParser.parseJPText(JapaneseText);
        
        const tokenSplit = SplitTokensBySentences(tokens, 30);

        //Should not spliut on the ! 
        expect(tokenSplit.length).toBe(1);
    });
    
    it("Splitting Text Standard Case", async () => {

        const JapaneseText = "これはライアンです。今日の天気がいいですね。";
        
        await JapaneseParticleParser.Initialize();
        const tokens = JapaneseParticleParser.parseJPText(JapaneseText);
        
        const tokenSplit = SplitTokensBySentences(tokens, 30);

        //Should not spliut on the ! 
        expect(tokenSplit.length).toBe(2);
        expect(tokenSplit[0][tokenSplit[0].length-1].surface_form).toBe("。");
        expect(tokenSplit[1][tokenSplit[1].length-1].surface_form).toBe("。");
    });

    it("No Ending Sentence Marker", async () => {

        const JapaneseText = fs.readFileSync("__tests__/SentenceSplitExample1.txt", "utf-8");

        await JapaneseParticleParser.Initialize();
        const tokens = JapaneseParticleParser.parseJPText(JapaneseText);
        
        const tokenSplit = SplitTokensBySentences(tokens, 80);

        //This text failed to split, there is an interesting encoding error in the string.
        expect(tokenSplit.length).toBeGreaterThan(1);
    });

    it("Splitting Text on Exceeding Max Length", async () => {

        const JapaneseText = "これはライアンです, 今日の天気がいいですね.";
        
        await JapaneseParticleParser.Initialize();
        const tokens = JapaneseParticleParser.parseJPText(JapaneseText);
        
        const tokenSplit = SplitTokensBySentences(tokens, 10);

        //Should not spliut on the ! 
        expect(tokenSplit.length).toBe(2);
        expect(tokenSplit[1][tokenSplit[1].length-1].surface_form).toBe(".");
    });

    it("Splitting Tokens on Multiple Consecutive Sentence Ending Marks", async () => {

        const JapaneseText = "これはライアンです。。。 今日の天気がいいですね.";
        const JapaneseText2 = "これはライアンです？！。 今日の天気がいいですね.";
        const JapaneseText3 = "「これはライアンです！？」。 今日の天気がいいですね.";

        await JapaneseParticleParser.Initialize();
        for(const text of [JapaneseText, JapaneseText2, JapaneseText3]){
           
            const tokens = JapaneseParticleParser.parseJPText(text);
            
            const tokenSplit = SplitTokensBySentences(tokens, 30);
            expect(tokenSplit.length).toBe(2);
            expect(tokenSplit[0][tokenSplit[0].length-1].surface_form).toBe("。");
        }
    });

    it("Ignore List of Excludes", async () => {
        
        //Kuromoji typically parses て as a particle, we should be able to add て to a black list for it not to be 
        //considered a particle by the helper function. 
        const JapaneseText = "これは厚いと言われている";
          
        await JapaneseParticleParser.Initialize();
        const tokens = JapaneseParticleParser.parseJPText(JapaneseText);

        const blackList = new Set(["て", "は"]);
        const particleCount = tokens.filter(token => IsParticle(token, blackList)).length;

        expect(particleCount).toBe(1);
    });

    it("No Ignore List Provided", async () => {
        
        //Kuromoji typically parses て as a particle, we should be able to add て to a black list for it not to be 
        //considered a particle by the helper function. 
        const JapaneseText = "これは厚いと言われている";
          
        await JapaneseParticleParser.Initialize();
        const tokens = JapaneseParticleParser.parseJPText(JapaneseText);

        const particleCount = tokens.filter(token => IsParticle(token)).length;

        expect(particleCount).toBe(3);
    });

    it("CountParticles Test: No Ignore List Provided", async () => {
        
        //Kuromoji typically parses て as a particle, we should be able to add て to a black list for it not to be 
        //considered a particle by the helper function. 
        const JapaneseText = "これは厚いと言われている";
          
        await JapaneseParticleParser.Initialize();
        const tokens = JapaneseParticleParser.parseJPText(JapaneseText);

        const particleCount = CountParticles(tokens);

        expect(particleCount).toBe(3); //は、と、て
    });

    it("CountParticles Test: Ignore List Provided", async () => {
        
        //Kuromoji typically parses て as a particle, we should be able to add て to a black list for it not to be 
        //considered a particle by the helper function. 
        const JapaneseText = "これは厚いと言われている";
          
        await JapaneseParticleParser.Initialize();
        const tokens = JapaneseParticleParser.parseJPText(JapaneseText);

        const particleCount = CountParticles(tokens, new Set(["て"]));

        expect(particleCount).toBe(2); //は、と
    });

    it("CountParticlesInSentences Test: Ignore List Provided", async () => {
        
        //Kuromoji typically parses て as a particle, we should be able to add て to a black list for it not to be 
        //considered a particle by the helper function. 
        const JapaneseText = "これはライアンです, 今日の天気がいいですね.";
          
        await JapaneseParticleParser.Initialize();
        const tokens = JapaneseParticleParser.parseJPText(JapaneseText);
        const sentences = SplitTokensBySentences(tokens);

        const particleCount = CountParticlesInSentences(sentences, new Set(["が", "ね"]));
        
        expect(particleCount).toBe(2); 
    });
});