import { IpadicFeatures } from "kuromoji";

export const CountCorrectAnswers = (
  sentence : IpadicFeatures[], 
  userInputs : Map<number, string>
) =>{

  let totalCorrect = 0;

  for(const answer of userInputs){
    if(sentence[answer[0]].surface_form === answer[1]){
      totalCorrect++;
    }          
  }
  
  return totalCorrect;
};