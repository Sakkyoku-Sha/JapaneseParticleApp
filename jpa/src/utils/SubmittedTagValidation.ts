import { IsKnown } from "../parsing/KuromojiHelperFunctions";
import { JapaneseParticleParser } from "../parsing/JapaneseParticleParser";

export const ValidateSubmittedTag = (tag : string, currentTags : string[]) : boolean => {
    
    return IsNotWhitespace(tag) && 
           IsNotAlreadyInList(tag, currentTags) && 
           IsKnownKuroMojiWord(tag); 
}

const IsNotWhitespace = (tag : string) => {
    return !(tag.trim() === ''); 
}

const IsNotAlreadyInList = (tag : string, currentTags : string[]) => {
    return !(currentTags.includes(tag));
}

//Would like to use something like .pos === 助詞 but this is simply done,
//Reminder that this use of JapaneseParticleParser is assuming the parser has been initialized. 
const IsKnownKuroMojiWord = (tag : string) => {
    const parseSubmittedTag = JapaneseParticleParser.parseJPText(tag); 
    return parseSubmittedTag.length === 1 && IsKnown(parseSubmittedTag[0]);
}
