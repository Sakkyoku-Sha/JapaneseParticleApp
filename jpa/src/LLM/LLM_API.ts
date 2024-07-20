export default interface LLM_API{
    sendPrompt : (prompt : string) => Promise<string>;
}