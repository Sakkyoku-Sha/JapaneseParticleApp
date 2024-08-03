import { ResponseLanguages } from "@/LLM/ResponseLanguages";
import { KnownParticles } from "@/parsing/KnownParticles";

export type PersistedUserOptions = {
    responselanguage: string, 
    particleIgnoreList: string[],
}
export const PersistUserOptions = (userOptions: PersistedUserOptions) =>{
    localStorage.setItem("userOptions", JSON.stringify(userOptions));
}
export const LoadUserOptions = () : PersistedUserOptions =>{
    const userOptions = localStorage.getItem("userOptions");
    if(userOptions === null){
        return defaultUserOptions;
    }
    return JSON.parse(userOptions) as PersistedUserOptions;
}
const defaultUserOptions: PersistedUserOptions = {
    responselanguage: ResponseLanguages.English,
    particleIgnoreList: [KnownParticles.te, KnownParticles.ne, KnownParticles.nado],
}