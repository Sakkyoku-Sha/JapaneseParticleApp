import { JapaneseParticleParser } from "@/parsing/JapaneseParticleParser";
import { ValidateSubmittedTag } from "@/parsing/SubmittedTagValidation";

describe("SubbmitedTagValidation", () => {

    beforeAll(async () => {
        await JapaneseParticleParser.Initialize();
    });

    it("White Space Basic Test", () => {
        const tagToAdd = " "; 
        const tags = new Array("て", "は");

        const result = ValidateSubmittedTag(tagToAdd, tags); 
        expect(result).toBe(false);
    });

    it("New Line Basic Test", () => {
        const tagToAdd = "\n"; 
        const tags = new Array("て", "は");

        const result = ValidateSubmittedTag(tagToAdd, tags); 
        expect(result).toBe(false);
    });

    //This test exits because if using IsParticle or .pos testing, で alone fails this test.
    it("Should allow で", () => {
        const tagToAdd = "で"; 
        const tags = new Array("て", "は");

        const result = ValidateSubmittedTag(tagToAdd, tags); 
        expect(result).toBe(true);
    });

    //This test exits because if using IsParticle or .pos testing, で alone fails this test.
    it("Should not allow existing tags", () => {
        const tagToAdd = "は"; 
        const tags = new Array("て", "は");

        const result = ValidateSubmittedTag(tagToAdd, tags); 
        expect(result).toBe(false);
    });

    it("Should not allow non japanese words", () => {
        const tagToAdd = "Hello"; 
        const tags = new Array("て", "は");

        const result = ValidateSubmittedTag(tagToAdd, tags); 
        expect(result).toBe(false);
    });
});