import { IpadicFeatures } from "kuromoji";
import { CountParticles, CountParticlesInSentences, IsParticle, IsKnown, IsTokenEndOfSentenceMarker, SplitTokensBySentences } from "../src/parsing/KuromojiHelperFunctions";
import { JapaneseParticleParser } from "@/parsing/JapaneseParticleParser";
import fs from "fs";

describe("IsTokenEndOfSentence", () => {

    beforeAll(async () => {
        await JapaneseParticleParser.Initialize();
    });

    it("Standard End of Sentence Expected Cases", () => {
       
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

    it("Nested Quotations Splitting Text", () => {

        const JapaneseText = "「これはライアンです！」と言います。";

        const tokens = JapaneseParticleParser.parseJPText(JapaneseText);
        const tokenSplit = SplitTokensBySentences(tokens, 30);

        //Should not spliut on the ! 
        expect(tokenSplit.length).toBe(1);
    });

    it("NonStandard Nested Quotations Splitting Text", () => {

        const JapaneseText = "『これはライアンです。』と言います。";
        
        const tokens = JapaneseParticleParser.parseJPText(JapaneseText);
        const tokenSplit = SplitTokensBySentences(tokens, 30);

        //Should not spliut on the ! 
        expect(tokenSplit.length).toBe(1);
    });
    
    it("Splitting Text Standard Case", async () => {

        const JapaneseText = "これはライアンです。今日の天気がいいですね。";
        
        const tokens = JapaneseParticleParser.parseJPText(JapaneseText);
        const tokenSplit = SplitTokensBySentences(tokens, 30);

        //Should not spliut on the ! 
        expect(tokenSplit.length).toBe(2);
        expect(tokenSplit[0][tokenSplit[0].length-1].surface_form).toBe("。");
        expect(tokenSplit[1][tokenSplit[1].length-1].surface_form).toBe("。");
    });

    it("No Ending Sentence Marker", async () => {

        const JapaneseText = fs.readFileSync("__tests__/SentenceSplitExample1.txt", "utf-8");

        const tokens = JapaneseParticleParser.parseJPText(JapaneseText);
        const tokenSplit = SplitTokensBySentences(tokens, 80);

        //This text failed to split, there is an interesting encoding error in the string.
        expect(tokenSplit.length).toBeGreaterThan(1);
    });

    it("Splitting Text on Exceeding Max Length", async () => {

        const JapaneseText = "これはライアンです, 今日の天気がいいですね.";
        
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

        for(const text of [JapaneseText, JapaneseText2, JapaneseText3]){
           
            const tokens = JapaneseParticleParser.parseJPText(text);
            
            const tokenSplit = SplitTokensBySentences(tokens, 30);
            expect(tokenSplit.length).toBe(2);
            expect(tokenSplit[0][tokenSplit[0].length-1].surface_form).toBe("。");
        }
    });

    it("Splitting Tokens on Ending Whitespace or Newlines", async () => {

        const JapaneseText = "これはライアンです。      ";
        const JapaneseText2 = "      これはライアンです。";
        const JapaneseText3 = "\t\t\tこれはライアンです。";
        const JapaneseText4 = "\t これはライアンです。   \n";

        for(const text of [JapaneseText, JapaneseText2, JapaneseText3, JapaneseText4]){
           
            const tokens = JapaneseParticleParser.parseJPText(text);
            
            const tokenSplit = SplitTokensBySentences(tokens, 30);
            expect(tokenSplit.length).toBe(1);
            expect(tokenSplit[0][0].surface_form).toBe("これ");
            expect(tokenSplit[0][tokenSplit[0].length-1].surface_form).toBe("。");
        }
    });

    it("Splitting Tokens on Repeated Internal Whitespace or Newlines", async () => {

        const JapaneseText = "これはライアンです。          これはボブです。";
        const JapaneseText2 = "これはライアンです。\n\n\n\nこれはボブです。";
        const JapaneseText3 = "これはライアンです。\t\t\t\tこれはボブです。";
        const JapaneseText4 = "これはライアンです。\n\t  これはボブです。";

        for(const text of [JapaneseText, JapaneseText2, JapaneseText3, JapaneseText4]){
           
            const tokens = JapaneseParticleParser.parseJPText(text);
            
            const tokenSplit = SplitTokensBySentences(tokens, 30);
            expect(tokenSplit.length).toBe(2);
            expect(tokenSplit[1][0].surface_form).toBe("これ");
        }
    });


    it("Ignore List of Excludes", async () => {
        
        //Kuromoji typically parses て as a particle, we should be able to add て to a black list for it not to be 
        //considered a particle by the helper function. 
        const JapaneseText = "これは厚いと言われている";
        const tokens = JapaneseParticleParser.parseJPText(JapaneseText);

        const blackList = ["て", "は"];
        const particleCount = tokens.filter(token => IsParticle(token, blackList)).length;

        expect(particleCount).toBe(1);
    });

    it("No Ignore List Provided", async () => {
        
        //Kuromoji typically parses て as a particle, we should be able to add て to a black list for it not to be 
        //considered a particle by the helper function. 
        const JapaneseText = "これは厚いと言われている";
          
        const tokens = JapaneseParticleParser.parseJPText(JapaneseText);
        const particleCount = tokens.filter(token => IsParticle(token)).length;

        expect(particleCount).toBe(3);
    });

    it("CountParticles Test: No Ignore List Provided", async () => {
        
        //Kuromoji typically parses て as a particle, we should be able to add て to a black list for it not to be 
        //considered a particle by the helper function. 
        const JapaneseText = "これは厚いと言われている";
          
        const tokens = JapaneseParticleParser.parseJPText(JapaneseText);
        const particleCount = CountParticles(tokens);

        expect(particleCount).toBe(3); //は、と、て
    });

    it("CountParticles Test: Ignore List Provided", async () => {
        
        //Kuromoji typically parses て as a particle, we should be able to add て to a black list for it not to be 
        //considered a particle by the helper function. 
        const JapaneseText = "これは厚いと言われている";
          
        const tokens = JapaneseParticleParser.parseJPText(JapaneseText);
        const particleCount = CountParticles(tokens, ["て"]);

        expect(particleCount).toBe(2); //は、と
    });

    it("CountParticlesInSentences Test: Ignore List Provided", async () => {
        
        //Kuromoji typically parses て as a particle, we should be able to add て to a black list for it not to be 
        //considered a particle by the helper function. 
        const JapaneseText = "これはライアンです, 今日の天気がいいですね.";
          
        const tokens = JapaneseParticleParser.parseJPText(JapaneseText);
        const sentences = SplitTokensBySentences(tokens);

        const particleCount = CountParticlesInSentences(sentences, ["が", "ね"]);
        
        expect(particleCount).toBe(2); 
    });

    it("IsKnown Basic Expectations", async () => {

        //Currently, if alone many particles are not marked as 助詞
        //For the time being we will allow any string as input, so long as kuromoji recognizes it as a word.
        const JapaneseText = "で";
          
        const tokens = JapaneseParticleParser.parseJPText(JapaneseText);

        expect(tokens.length).toBe(1);
        expect(IsParticle(tokens[0])).toBeFalsy();
        expect(IsKnown(tokens[0])).toBeTruthy();
    });
});