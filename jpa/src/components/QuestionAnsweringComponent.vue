<!-- Must Define a non script setup area to define a type which is exported-->
<script lang="ts">
//Defined Components 
import SentenceCarousel from "@/components/SentenceCarousel.vue";
import MarkDownRenderer from "@/components/MarkDownRenderer.vue";

//Vue Imports 
import {defineProps, withDefaults, computed, ref, provide, Ref, onUnmounted} from 'vue';

//Japanese Parsing 
import {CountParticlesInSentences, SplitTokensBySentences} from "@/parsing/KuromojiHelperFunctions";
import {JapaneseParticleParser} from "@/parsing/JapaneseParticleParser";
import {IpadicFeatures} from "kuromoji";

//LLM Integration
import {GeneratePromptFromWrongAnswer} from "@/LLM/PromptGenerator";
import GPT_API from "@/LLM/CHATGPT_API";

//User Settings Related 
import {LoadUserOptions, PersistUserOptions} from "@/persistance/PersistedUserOptions";
import {ResponseLanguages} from "@/LLM/ResponseLanguages";

//Context Definition for Child Components
export const QuestionAnsweringComponentContextKey = "QAContext";
export type QuestionAnsweringComponentContextType = {
  workingSplitTokens : IpadicFeatures[][],
  workingSentenceIndex: Ref<number>,
  markedStates : Ref<Array<boolean>>,
  particleIgnoreList: Ref<Set<string>>,

  updateWorkingSentence : (sentenceIndex: number) => void,
  updateExplanation : (baseToken : IpadicFeatures, guessIndex : number) => void,
  setUserInput: (sentenceIndex : number, wordIndex: number, value: string) => void,
  getUserInput : (sentenceIndex : number, wordIndex: number) => string | undefined,
  returnToTextInput: () => void,
};
</script>

<script setup lang="ts">

//Props Definition
type QuestionAnsweringComponentProps = {
  userText: string;
  returnToTextInput: () => void;
};
const props = withDefaults(defineProps<QuestionAnsweringComponentProps>(), {});


//Compute the Parsed Tokens
const analyzedTokens = computed(() => {
  return JapaneseParticleParser.parseJPText(props.userText);
});

//Organize the Tokens into Displayable Groupings.
const workingSplitTokens = computed(() => {
  return SplitTokensBySentences(analyzedTokens.value);
});

//User Options Fields 
const userOptions = computed(() => {
  return LoadUserOptions();
});

const particleIgnoreList = ref(new Set<string>(userOptions.value.particleIgnoreList));
const responseLanguage = ref<string>(userOptions.value.responselanguage);

// const updateParticleIgnoreList = (newIgnoreList : Set<string>) => {
//   particleIgnoreList.value = newIgnoreList;
//   PersistUserOptions({responselanguage: responseLanguage.value, particleIgnoreList: Array.from(newIgnoreList)});
// };
const updateResponseLanguage = (newLanguage : string) => {
  responseLanguage.value = newLanguage;
  PersistUserOptions({responselanguage: newLanguage, particleIgnoreList: Array.from(particleIgnoreList.value)});
};


//LLM Integration
const currentExplanation = ref("");
const LLM_API = new GPT_API(); 
const LoadingResponse = ref(false);

const GenerateCacheKey = (guessIndex : number, guess : string) => {
  return `${guessIndex}-${guess}`;
}
const mapGuessKeyToResultCache = new Map<string, string>();
const clearCache = () => {
  mapGuessKeyToResultCache.clear();
}
onUnmounted(() => {
  clearCache();
}); 

//Generation Explanation Function to be passed down to child components. 
const updateExplanation = async (baseToken : IpadicFeatures, guessIndex : number) => {

  //Check if the result is already cached.
  const cacheKey = GenerateCacheKey(guessIndex, baseToken.surface_form);
  const cached = mapGuessKeyToResultCache.get(cacheKey);
  if(cached !== undefined){
    currentExplanation.value = cached;
    return;
  }

  //Set Loading State for Expression
  LoadingResponse.value = true;

  //Generate the Prompt
  const guess = userInputs.value[workingSentenceIndex.value].get(guessIndex) ?? "";
  const correctAnswer = baseToken.surface_form;
  const allDisplayedStrings = workingSplitTokens.value[workingSentenceIndex.value].map((token) => token.surface_form);
  const prompt = GeneratePromptFromWrongAnswer(guess, correctAnswer, guessIndex, allDisplayedStrings, props.userText, responseLanguage.value);
  
  //Execute the prompt; 
  const explanation = await LLM_API.sendPrompt(prompt);

  //Cache the result for future use.
  mapGuessKeyToResultCache.set(cacheKey, explanation);

  //Update ref value to cause UI to update. 
  currentExplanation.value = explanation;
  LoadingResponse.value = false;
}

//User Input State 
const workingSentenceIndex = ref(0);
const markedStates = ref<Array<boolean>>(new Array<boolean>(workingSplitTokens.value.length).fill(false));
const userInputs = ref<Array<Map<number, string>>>(new Array<Map<number, string>>(workingSplitTokens.value.length).fill(new Map<number, string>()));

const updateWorkingSentence = (sentenceIndex: number) => {
    workingSentenceIndex.value = sentenceIndex;
};
const clearMarkedStates = () => {
  markedStates.value = new Array<boolean>(workingSplitTokens.value.length).fill(false);
  clearCache();
}
const setUserInput = (sentenceIndex : number, wordIndex: number, value: string) => {
  if(userInputs.value[sentenceIndex] === undefined){
    userInputs.value[sentenceIndex] = new Map<number, string>();
  }
  userInputs.value[sentenceIndex].set(wordIndex, value);
}
const getUserInput = (sentenceIndex : number, wordIndex: number) => {
  return userInputs.value[sentenceIndex]?.get(wordIndex) ?? undefined;
}

//Derived Values for UI 
const totalNumberOfQuestions = computed(() => {
  return CountParticlesInSentences(workingSplitTokens.value, particleIgnoreList.value);
})

const totalQuestionsCorrect = computed(() => {
  
  let totalCorrect = 0;
  
  for(let i = 0; i < markedStates.value.length; i++){
    
    if(markedStates.value[i] === true){
      const markedSentence = workingSplitTokens.value[i]; 
      const userInputsForSentence = userInputs.value[i];

      for(let j = 0; j < markedSentence.length; j++){
        const token = markedSentence[j];
        const userInput = userInputsForSentence.get(j) ?? "";
        if(particleIgnoreList.value.has(token.surface_form) === false && token.surface_form === userInput){
          totalCorrect++;
        }
      }
      
    }
  }

  return totalCorrect;
});

const progressRatio = computed(() => {
  const numberMarked = markedStates.value.reduce((count, value) => count + (value === true ? 1 : 0), 0);
  return numberMarked / markedStates.value.length;
})

//User Input Functions 
const onMarkButtonClick = () => {
  markedStates.value[workingSentenceIndex.value] = true;
}
const onLanguageSelected = (event : Event) => {
  const value = (event.target as HTMLSelectElement).value;
  updateResponseLanguage(value);
}

//define context for the child components to avoid props bloat. 
const context : QuestionAnsweringComponentContextType = {
  workingSplitTokens : workingSplitTokens.value,
  workingSentenceIndex: workingSentenceIndex,
  markedStates : markedStates,
  particleIgnoreList: particleIgnoreList,

  updateWorkingSentence : updateWorkingSentence,
  updateExplanation : updateExplanation,
  setUserInput: setUserInput,
  getUserInput : getUserInput,
  returnToTextInput: props.returnToTextInput
}
provide(QuestionAnsweringComponentContextKey, context);

</script>

<template>
    <div class="container">

        <div class="panes">
          <div class="left-pane">
            <SentenceCarousel class="sentenceCarouselContainer"/>
            <button class="mark-button" @click="onMarkButtonClick">
              {{ 'Mark' }}
            </button>
          </div>
          <div class="right-pane">
            <MarkDownRenderer class="markDownContainer" :markDownText="currentExplanation" :isLoading="LoadingResponse"/>
            <div class="userOptions">
              <div class="option-group">
                <span>Language: </span>
                <select @change="onLanguageSelected">
                  <option v-for="language in Object.values(ResponseLanguages)" :key="language" :value="language" :selected="responseLanguage === language">
                    {{ language }}
                  </option>
                </select>
              </div>
              <div class="option-group">
                <button @click="props.returnToTextInput">Return to Text Input</button>
                <button @click="clearMarkedStates">Clear Marked States</button>
              </div>
              <div class="score-tally">
                Correct Answers: {{ totalQuestionsCorrect }} / {{ totalNumberOfQuestions }}
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar" :style="{ width: progressRatio * 100 + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<style scoped>

.panes {
    display: flex;
    width: 100%;
    flex: 1; /* Take up remaining space */
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.left-pane {
  flex: 7; /* 70% width */
  padding: 10px; /* Optional: Add some padding */
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sentenceCarouselContainer {
  width: 100%;
  flex: 39;
}

.mark-button { 
  width: 100%;
  flex: 1;
  background-color: #10d14d;
  color: white;
  border: none; 
  padding: 15px;
  margin-bottom: 15px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.mark-button:hover {
  background-color: #037d40;
}

.right-pane {
  height: 100%;
  flex: 3;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #322f2f;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.markDownContainer {
  width: 100%;
  flex: 7;
  overflow: auto;
}

.userOptions {
  flex: 3;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  width: 100%;
}

.userOptions {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.option-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.option-group select {
  padding: 5px;
  font-size: 16px;
}
button {
  padding: 10px 15px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

.score-tally {
  font-size: 18px;
  font-weight: bold;
}

.progress-bar-container {
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar {
  height: 20px;
  background-color: #76c7c0;
  width: 0;
  transition: width 0.3s ease;
}

/* Scrollbar styling */
.markDownContainer::-webkit-scrollbar {
  width: 12px;
}

.markDownContainer::-webkit-scrollbar-track {
  background: #595858;
  border-radius: 10px;
}

.markDownContainer::-webkit-scrollbar-thumb {
  background-color: #111111;
  border-radius: 10px;
  border: 3px solid #595858;
}

.markDownContainer::-webkit-scrollbar-thumb:hover {
  background-color: #111111;
}
</style>