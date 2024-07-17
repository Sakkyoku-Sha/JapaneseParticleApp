import { JapaneseParticleParser } from "@/parsing/JapaneseParticleParser";
import { KuromojiHelperFunctions } from "@/parsing/KuroMojiHelperFunctions";
import { IpadicFeatures } from "kuromoji";

export const GlobalTextContext = {
    
    SubmittedText : "",
    AnalyzedTokens : [] as IpadicFeatures[],
    UserAnswers : {} as Map<number, string>, //Index to Token to Users inputted Answer

    //The currently displayed range of tokens from the AnalyzedTokens array
    DisplayRangeMin : -1 as number,
    DisplayRangeMax : -1 as number, 
     
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
 
export function findNextDisplayRange(currMinRange: number, currMaxRange: number, tokens: IpadicFeatures[]){

    const tokensLength = tokens.length;
    if(currMaxRange >= tokensLength){
        return [currMinRange, currMaxRange];
    }
    
    //Using -1, -1 tp say nothing new cna be displayed 
    const nextMinRange = currMaxRange+1;
    if(nextMinRange >= tokensLength){return [-1, -1];}

    //Find the next end of a sentence. 
    let nextMaxRange = currMaxRange+2; 
    while(nextMaxRange < tokensLength){
        if(IsEndOfSentence(nextMaxRange, tokens)){
            break;
        }
        nextMaxRange++;
    }

    return [nextMinRange, nextMaxRange];
}

//Not a perfect solution for now. But for no we will just say if the parsed word contains one of these 
//characters it is more than likely the end of a sentence. (This fails in the case of quotations).  
export function IsEndOfSentence(i : number, tokens : IpadicFeatures[]){
    return /[？。.?!！]/.test(tokens[i].surface_form);
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



