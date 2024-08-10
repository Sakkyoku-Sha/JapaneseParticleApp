import { InputView_Span } from "@/components/InputViewSpanDefinition";
import { IsParticle } from "@/parsing/KuromojiHelperFunctions";
import { IpadicFeatures } from "kuromoji";
import { containsKanji, kanaToHiragana } from "./JapaneseTextTools";

export const CreateInputViewDefinition = (
    workingSentence : IpadicFeatures[], 
    isMarked : boolean,
    getUserInput : (wordIndex : number) => string | undefined,
    explainButtonOnClick? : (wordIndex : number) => void,
    onInputChange? : (wordIndex : number, value : string) => void,
    ignoredParticles? : string[],
    displayFurigana? : boolean
) : InputView_Span[] => {

    const workingSetenceLength = workingSentence.length; 
    const inputViewDefinitions = new Array<InputView_Span>(workingSetenceLength);
    
    for(let i = 0; i < workingSetenceLength; i++){
        
        const currentWord = workingSentence[i]; 
        const surface_form = currentWord.surface_form;

        let currentDefinition : InputView_Span; 
       
        if(IsParticle(currentWord, ignoredParticles)){
            
            const userInput = getUserInput(i);
            const isCorrect = userInput === surface_form; 

            if(!isMarked){
                const onInputChangedWrapper = OnInputChangedWrapper(i, onInputChange);
                currentDefinition = {type: "Input", text: userInput ?? "", length: surface_form.length, markedState: "Unmarked", OnInputChange : onInputChangedWrapper};    
            }
            else if(isCorrect){
                currentDefinition = {type: "Input", text: surface_form, length: surface_form.length, markedState: "Correct" };
            }
            else if(userInput === undefined || userInput === ""){
                currentDefinition = {type: "Input", text: surface_form, length: surface_form.length, markedState : "NotAnswered"}
            }
            else{
                const onClickWrapper = ExplainButtonOnClickWrapper(i, explainButtonOnClick);
                currentDefinition = {type: "Button", text: userInput, OnClick: onClickWrapper}
            }
        }
        else{
            let furigana = undefined;
            if(displayFurigana && currentWord.reading && containsKanji(surface_form))
            {
                furigana = kanaToHiragana(currentWord.reading);
            }
            
            currentDefinition = {type : "Text", text:  surface_form, furigana: furigana};
        }
 
        inputViewDefinitions[i] = currentDefinition;
    }

    return inputViewDefinitions;
}

const OnInputChangedWrapper = (
    wordIndex : number, 
    onInputChange? : (wordIndex : number, value : string) => void) => 
{
    return (value : string) => {
        onInputChange?.(wordIndex, value)
    }
};

const ExplainButtonOnClickWrapper = (
    guessIndex : number,
    explainButtonOnClick? : (guessIndex : number) => void) => 
{
    return () => {
        explainButtonOnClick?.(guessIndex);
    };   
}


