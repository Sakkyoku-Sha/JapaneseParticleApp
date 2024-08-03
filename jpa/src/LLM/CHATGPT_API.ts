import LLM_API from "./LLM_API";
import OpenAI from "openai";

const openai = new OpenAI({apiKey: '', dangerouslyAllowBrowser: true});

export default class CHATGPT_API implements LLM_API{

    sendPrompt(prompt: string): Promise<string> {
        return this.#sendPromptToGPT4(prompt) 
    }

    async #sendPromptToGPT4(prompt: string): Promise<string> {
        
        const chatCompletion = await openai.chat.completions.create({           
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o-mini",
        });
        return chatCompletion.choices[0].message.content ?? "";
    }
}



