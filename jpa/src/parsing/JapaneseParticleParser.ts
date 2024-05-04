import { IpadicFeatures, Tokenizer, TokenizerBuilder, builder } from "kuromoji";

//Initialize the Kuromoji tokenizer and load the kuroMoji dictionaries into memory (This is a one time operation) 
//Unfortunately, the kuromoji library does not support async/await, so we have to use a call back function and have a "tokenizer" that doesn't 
//technically exist untill Kuromojis call to fs.readFile is complete. Where the call back will then be called. That fs.readFile is not exposed 
//so we have to do it this way. 
const kuroMojiEngine : TokenizerBuilder<IpadicFeatures> = builder({ dicPath: 'kuromojiDictionaries' });
let kuroMojiTokenizer : Tokenizer<IpadicFeatures> | null; 
kuroMojiEngine.build((err: Error | null, tokenizer: Tokenizer<IpadicFeatures>) => {
    if(err){
        console.warn(err);
    }
    kuroMojiTokenizer = tokenizer;
});

export default class JapaneseParticleParser{

    parseJPText(text : string) : IpadicFeatures[] {

        // Parse the sentences using Kuromoji
        return kuroMojiTokenizer?.tokenize(text) ?? [];
    }

    splitJPText(text : string) : string[] {
        
        // Split the text into sentences based on a specific pattern
        const sentences = text.split(/。/);
    
        // Remove any empty sentences
        const filteredSentences = sentences.filter(sentence => sentence.length > 0);
    
        // Return the array of parsed sentences
        return filteredSentences;
    }
}