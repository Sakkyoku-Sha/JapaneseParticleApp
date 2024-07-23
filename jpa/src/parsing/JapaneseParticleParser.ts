import { IpadicFeatures, Tokenizer, TokenizerBuilder, builder } from "kuromoji";

//todo move this to an enviroment file 
const basePath = process.env.JEST_WORKER_ID !== undefined ? 
    "public/" : // Adjust <rootDir> and path as necessary for Jest
    ""; // The path used in deployment


const kuroMojiEngine : TokenizerBuilder<IpadicFeatures> = builder({ dicPath: basePath + 'kuromojiDictionaries'});
let kuroMojiTokenizer : Tokenizer<IpadicFeatures> | null; 

export const JapaneseParticleParser = {

    async Initialize() : Promise<void>{

        if(kuroMojiTokenizer !== undefined) 
            return; 

        //The kuromoji library doesn't expose the async from it's fs.readFile so this is a workaround
        return new Promise((resolve, reject) => {
            kuroMojiEngine.build((err: Error | null, tokenizer: Tokenizer<IpadicFeatures>) => {
                if(err){
                    reject(err);
                }
                kuroMojiTokenizer = tokenizer;
                resolve();
            });
        });
    },

    parseJPText(text : string) : IpadicFeatures[] {
        // Parse the sentences using Kuromoji
        return kuroMojiTokenizer?.tokenize(text) ?? [];
    }
}