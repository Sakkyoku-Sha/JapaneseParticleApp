export function GeneratePromptFromWrongAnswer
(guess : string,
 correctAnswer : string, 
 guessIndex : number,
 allDisplayedStrings : string[], 
 fullContext : string, 
 responseLanguage : string = "English"){

    let prompt = "This is a test of Japanese Grammar, where one has to insert the correct grammar point in the underlined spot. " 
    prompt +=    "The following is the question:\n";
    
    prompt +=  allDisplayedStrings.map((string, index) => {
        if(index == guessIndex){
            return (new Array<string>(guess.length).fill('_').join());
        }
        return string;
    }).join(" ");

    prompt += "\n";

    prompt += "The answer provided was: " + guess + "\n";
    prompt += "The correct answer is: " + correctAnswer + "\n";
    prompt += "The full context is: " + fullContext + "\n";
    prompt += "Please explain why the answer provided is incorrect and why the correct answer is correct.\n";
    prompt += "Please reply in " + responseLanguage + ".";

    return prompt;
}