const OpenAI = require('openai');

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

const sendPromptToGPT4 = async (prompt) => {
    
    const chatCompletion = await openai.chat.completions.create({           
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o-mini",
    });
    return chatCompletion.choices[0].message.content ?? "";
};

module.exports = { sendPromptToGPT4 };


