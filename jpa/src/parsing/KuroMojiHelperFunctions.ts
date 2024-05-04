import { IpadicFeatures } from "kuromoji";

export const KuromojiHelperFunctions = {
    IsParticle(KuromojiToken : IpadicFeatures){
        return KuromojiToken.pos === '助詞'; 
    }
}