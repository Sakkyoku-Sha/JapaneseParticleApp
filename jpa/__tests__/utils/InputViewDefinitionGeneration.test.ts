import {CreateInputViewDefinition} from '@/utils/InputViewDefinitionGeneration';
import {JapaneseParticleParser} from '@/parsing/JapaneseParticleParser';
import { InputView_ExplainButtonSpan, InputView_InputSpan, InputView_TextSpan } from '@/components/InputViewSpanDefinition';

describe("Create InputView Definitions Tests", () => {

    beforeAll(async () => {
        await JapaneseParticleParser.Initialize();
    });

    it("Non Particle Returns as TextSpan", () => {

        const sentence = JapaneseParticleParser.parseJPText("テキスト");
        const getInputFunc = getUserInputMock([]); 

        //Not Marked Case 
        let definition = CreateInputViewDefinition(sentence, false, getInputFunc);
        expect(definition.length).toBe(1);
        expect(definition[0].text).toBe("テキスト");
        expect(definition[0].type).toBe("Text");
        
        //Marked Case has no impact
        definition = CreateInputViewDefinition(sentence, true, getInputFunc);
        expect(definition.length).toBe(1);
        expect(definition[0].text).toBe("テキスト");
        expect(definition[0].type).toBe("Text");
    });

    it("Unmarked Particle Returns as Input with No Text", () => {

        const sentence = JapaneseParticleParser.parseJPText("私がライアン");
        const getInputFunc = getUserInputMock({1 : "ぐ"}); 

        const onInputChange = jest.fn((wordIndex : number, value : string) => {});
        const definition = CreateInputViewDefinition(sentence, false, getInputFunc, undefined, onInputChange);
        const inputSpan = definition[1] as InputView_InputSpan; 

        expect(definition.length).toBe(3);
        expect(inputSpan.text).toBe("ぐ");
        expect(inputSpan.type).toBe("Input");
        expect(inputSpan.OnInputChange).toBeDefined();

        inputSpan.OnInputChange?.("value");
        expect(onInputChange).toHaveBeenCalled();
    });

    it("Marked Correct Particle Returns as Input with Text", () => {

        const sentence = JapaneseParticleParser.parseJPText("私がライアン");
        const getInputFunc = getUserInputMock({1 : "が"}); 

        const definition = CreateInputViewDefinition(sentence, true, getInputFunc);
        expect(definition.length).toBe(3);
        expect(definition[1].text).toBe("が");
        expect(definition[1].type).toBe("Input");
        expect((definition[1] as InputView_InputSpan).markedState).toBe("Correct");
    });

    it("Marked Incorrect Particle Returns as Button with Text", () => {

        const sentence = JapaneseParticleParser.parseJPText("私がライアン");
        const getInputFunc = getUserInputMock({1 : "ぐ"}); 

        const onClickFunc = jest.fn((guessIndex : number) => {});
        const definition = CreateInputViewDefinition(sentence, true, getInputFunc, onClickFunc);
        const explainButton = definition[1] as InputView_ExplainButtonSpan;

        expect(definition.length).toBe(3);
        expect(explainButton.text).toBe("ぐ");
        expect(explainButton.type).toBe("Button");
        expect(explainButton.OnClick).toBeDefined();

        explainButton.OnClick?.();
        expect(onClickFunc).toHaveBeenCalled();
    });

    it("Ignored Particle List Interactions", () => {

        const sentence = JapaneseParticleParser.parseJPText("彼が嬉しい");
        const getInputFunc = getUserInputMock({1 : "ぐ"}); 

        //Not Marked Case 
        let definition = CreateInputViewDefinition(sentence, false, getInputFunc, undefined, undefined, ["が"]);
        expect(definition[1].text).toBe("が");
        expect(definition[1].type).toBe("Text");

        //Marked Case 
        definition = CreateInputViewDefinition(sentence, true, getInputFunc, undefined, undefined, ["が"]);
        expect(definition[1].text).toBe("が");
        expect(definition[1].type).toBe("Text");
    });

    it("Unmarked Input Text is empty when no user Input, and filled when there Is", () => {

        const sentence = JapaneseParticleParser.parseJPText("彼女の猫は黒い");
        const getInputFunc = getUserInputMock({1 : "の", 3 : ""}); 

        //Not Marked Case
        let definition = CreateInputViewDefinition(sentence, false, getInputFunc, undefined, undefined, ["が"]);
        expect(definition[1].text).toBe("の");
        expect(definition[3].text).toBe("");
    });

    it("Marked Complex Case", () => {

        const sentence = JapaneseParticleParser.parseJPText("彼は僕にペンを挙げました");
        const getInputFunc = getUserInputMock({1 : "が", 3 : "に"}); 

        const definition = CreateInputViewDefinition(sentence, true, getInputFunc);
        
        //Expected Types 
        const span0 = definition[0] as InputView_TextSpan;
        const span1 = definition[1] as InputView_ExplainButtonSpan; //Wrong Input 
        const span2 = definition[2] as InputView_TextSpan;
        const span3 = definition[3] as InputView_InputSpan; //Correct Input 
        const span4 = definition[4] as InputView_TextSpan;
        const span5 = definition[5] as InputView_InputSpan; //No Input 
        const span6 = definition[6] as InputView_TextSpan;   
        
        expect(span0.type).toBe("Text");
        expect(span0.text).toBe("彼");

        expect(span1.type).toBe("Button");
        expect(span1.text).toBe("が");

        expect(span2.type).toBe("Text");
        expect(span2.text).toBe("僕");

        expect(span3.type).toBe("Input");
        expect(span3.text).toBe("に");
        expect(span3.markedState).toBe("Correct");

        expect(span4.type).toBe("Text");
        expect(span4.text).toBe("ペン");

        expect(span5.type).toBe("Input");
        expect(span5.text).toBe("を");
        expect(span5.markedState).toBe("NotAnswered");

        expect(span6.type).toBe("Text");
        expect(span6.text).toBe("挙げ");
    });

    it("UnMarked Complex Case", () => {

        const sentence = JapaneseParticleParser.parseJPText("彼は僕にペンを挙げました");
        const getInputFunc = getUserInputMock({1 : "が", 3 : "に"}); 

        const definition = CreateInputViewDefinition(sentence, false, getInputFunc);
        
        //Expected Types 
        const span0 = definition[0] as InputView_TextSpan;
        const span1 = definition[1] as InputView_InputSpan; //Wrong Input 
        const span2 = definition[2] as InputView_TextSpan;
        const span3 = definition[3] as InputView_InputSpan; //Correct Input 
        const span4 = definition[4] as InputView_TextSpan;
        const span5 = definition[5] as InputView_InputSpan; //No Input 
        const span6 = definition[6] as InputView_TextSpan;   
        
        expect(span0.type).toBe("Text");
        expect(span0.text).toBe("彼");

        expect(span1.type).toBe("Input");
        expect(span1.text).toBe("が");
        expect(span1.markedState).toBe("Unmarked");

        expect(span2.type).toBe("Text");
        expect(span2.text).toBe("僕");

        expect(span3.type).toBe("Input");
        expect(span3.text).toBe("に");
        expect(span3.markedState).toBe("Unmarked");

        expect(span4.type).toBe("Text");
        expect(span4.text).toBe("ペン");

        expect(span5.type).toBe("Input");
        expect(span5.text).toBe("");
        expect(span5.markedState).toBe("Unmarked");

        expect(span6.type).toBe("Text");
        expect(span6.text).toBe("挙げ");
    });

    it("Furigana Added when Enabled", () => {
        const sentence = JapaneseParticleParser.parseJPText("私がライアン");
        const getInputFunc = getUserInputMock({});

        //Enable Furigana
        let definition = CreateInputViewDefinition(sentence,false,getInputFunc, undefined, undefined, undefined, true);

        expect(definition.length).toBe(3);
        expect((definition[0] as InputView_TextSpan).furigana).toBe("わたし");
        expect((definition[1] as InputView_TextSpan).furigana).toBe(undefined);
        expect((definition[2] as InputView_TextSpan).furigana).toBe(undefined);

        //Disable Furigana
        definition = CreateInputViewDefinition(sentence,false,getInputFunc, undefined, undefined, undefined, false);
        expect((definition[0] as InputView_TextSpan).furigana).toBe(undefined);
        expect((definition[1] as InputView_TextSpan).furigana).toBe(undefined);
        expect((definition[2] as InputView_TextSpan).furigana).toBe(undefined);
    });
});

const getUserInputMock = (map : Record<number, string>) => {
    return (index : number) => {
        if(index in map){
            return map[index];
        }
        return undefined;
    };
}