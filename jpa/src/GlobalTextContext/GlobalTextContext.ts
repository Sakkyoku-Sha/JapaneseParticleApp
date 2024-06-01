import { JapaneseParticleParser } from "@/parsing/JapaneseParticleParser";
import { KuromojiHelperFunctions } from "@/parsing/KuroMojiHelperFunctions";
import { IpadicFeatures } from "kuromoji";

export const GlobalTextContext = {
    
    SubmittedText : "",
    AnalyzedTokens : [] as IpadicFeatures[],
    UserAnswers : {} as Map<number, string>, //Index to Token to Users inputted Answer

    onTextSubmitSubscriptions : [] as ((string: string) => void)[],

    subscribeToSubmittedTextChanged(callback : (string: string) => void){
        this.onTextSubmitSubscriptions.push(callback);
    },
    unsubscribeToSubmittedTextChanged(callback : (string: string) => void){
        const index = this.onTextSubmitSubscriptions.indexOf(callback);
        if(index > -1){
            this.onTextSubmitSubscriptions.splice(index, 1);
        }
    },
    onSubmittedTextChanged(text : string){
        this.SubmittedText = text;
        this.onTextSubmitSubscriptions.forEach(callback => callback(text));
        
        this.AnalyzedTokens = JapaneseParticleParser.parseJPText(text)
        this.UserAnswers = initializeUserAnswers(this.AnalyzedTokens); //Clear the user answers           
    }
} 

function initializeUserAnswers(tokens : IpadicFeatures[]) : Map<number, string>{
    
    const newUserAnswers = new Map<number, string>();
    tokens.forEach((token, index) => {
        if(KuromojiHelperFunctions.IsParticle(token)){
            newUserAnswers.set(index, "");
        }
    });

    return newUserAnswers;
}