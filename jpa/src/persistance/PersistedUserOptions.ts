import { ResponseLanguages } from "@/LLM/ResponseLanguages";
import { KnownParticles } from "@/parsing/KnownParticles";

export type PersistedUserOptions = {
    responseLanguage: string, 
    particleIgnoreList: string[],
    displayFurigana: boolean
}

const userOptionsKey = "JPGrammarQuestionWebsite"
export const PersistUserOptions = (userOptions: PersistedUserOptions) =>{
    localStorage.setItem(userOptionsKey, JSON.stringify(userOptions));
}
export const LoadUserOptions = () : PersistedUserOptions =>{
    const userOptions = localStorage.getItem(userOptionsKey);
    if(userOptions === null){
        return defaultUserOptions;
    }
    return JSON.parse(userOptions) as PersistedUserOptions;
}
const defaultUserOptions: PersistedUserOptions = {
    responseLanguage: ResponseLanguages.English,
    particleIgnoreList: [KnownParticles.te, KnownParticles.ne, KnownParticles.nado],
    displayFurigana: false,
}