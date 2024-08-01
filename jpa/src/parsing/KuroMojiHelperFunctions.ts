import { IpadicFeatures } from "kuromoji";

export const IsParticle = (KuromojiToken : IpadicFeatures, ignoreList? : Set<string>) => {
    return KuromojiToken.pos === '助詞' && !ignoreList?.has(KuromojiToken.surface_form); 
}

const sentenceEndPattern = /[。！？.!?]/; 
const quotationOpenPattern = /[【「『“‘]/;
const quotationEndPattern = /[】」』”’]/;

export const IsTokenEndOfSentenceMarker = (kuromojiToken : IpadicFeatures) => { 
    return sentenceEndPattern.test(kuromojiToken.surface_form);
}

export const IsTokenOpenQuotationMarker = (kuromojiToken : IpadicFeatures) => {
    return quotationOpenPattern.test(kuromojiToken.surface_form);
}

export const IsTokenClosedQuotationMarker = (kuromojiToken : IpadicFeatures) => {
    return quotationEndPattern.test(kuromojiToken.surface_form);
}

export const SplitTokensBySentences = (kuromojiTokens : IpadicFeatures[], maxTokensPerSentence : number  = 80) : IpadicFeatures[][] => {

    const quotationStack : string[] = [];
    const sentences : IpadicFeatures[][] = [];

    let currentSentence : IpadicFeatures[] = [];
    let isInQuotation = false;
    let currentTokenCount = 0; 

    for (let i = 0; i < kuromojiTokens.length; i++) {
        
        const token = kuromojiTokens[i];
        currentSentence.push(token);
        currentTokenCount++; 

        if(currentTokenCount > maxTokensPerSentence){
            sentences.push(currentSentence);
            currentSentence = [];
            currentTokenCount = 0;
        }

        if(IsTokenOpenQuotationMarker(token)){
            quotationStack.push(token.surface_form);
            isInQuotation = true;
        } 
        else if(IsTokenClosedQuotationMarker(token)){
            quotationStack.pop();
            isInQuotation = quotationStack.length > 0; //ignoring sentences like "」」」「「「" for now
        } 
        else if(IsTokenEndOfSentenceMarker(token) && !isInQuotation){
            sentences.push(currentSentence);
            currentSentence = [];
            currentTokenCount = 0;
        }
    }

    //Handles cases where the last sentence does not end in a period
    if(currentSentence.length > 0){
        sentences.push(currentSentence);
    }

    return sentences; 
}