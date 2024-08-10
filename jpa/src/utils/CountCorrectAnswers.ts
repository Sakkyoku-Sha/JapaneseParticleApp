import { IpadicFeatures } from "kuromoji";

export const CountCorrectAnswers = (
  sentences : IpadicFeatures[][],
  markedSentences: Array<boolean>, 
  getUserInputs : (setenceIndex : number) => Map<number, string>
) =>{

  let totalCorrect = 0;
  
  for(let i = 0; i < markedSentences.length; i++){
    
    if(markedSentences[i] === true){
        const markedSentence = sentences[i]; 
        const userInputs = getUserInputs(i);

        for(const answer of userInputs){
            if(answer[1] === markedSentence[answer[0]].surface_form){
                totalCorrect++;
            }
        }
    }
  }

  return totalCorrect;
};