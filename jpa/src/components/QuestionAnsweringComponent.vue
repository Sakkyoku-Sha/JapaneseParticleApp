<script setup lang="ts">
//Vue Imports 
import {ref, computed, onUnmounted} from 'vue';

//Defined Vue Components 
import SentenceCarousel from "@/components/SentenceCarousel.vue";
import MarkDownRenderer from "@/components/MarkDownRenderer.vue";
import Toolbox from "@/components/ToolboxComponent.vue";

//Japanese Parsing 
import {CountParticlesInSentences, SplitTokensBySentences} from "@/parsing/KuromojiHelperFunctions";
import {JapaneseParticleParser} from "@/parsing/JapaneseParticleParser";
import {IpadicFeatures} from "kuromoji";

//LLM Integration
import {GeneratePromptFromWrongAnswer} from "@/LLM/PromptGenerator";
import GPT_API from "@/LLM/CHATGPT_API";

//User Settings 
import {LoadUserOptions, PersistUserOptions} from "@/persistance/PersistedUserOptions";
import { CountCorrectAnswers } from '@/utils/CountCorrectAnswers';

//Load Potentially Persisted User Options
const userOptions = LoadUserOptions();

//Local Types 
type UserInputMode = "TextInput" | "QuestionAnswering";
var userInputs = new Array<Map<number, string>>();

//LLM API 
const LLM_API = new GPT_API(); 

//Reactivity Variables
const userInputMode = ref<UserInputMode>("TextInput"); 
const currentText = ref<string>("この文章はただの例です。助詞を習うのが難しいので是非ともこのウェブサイトを利用してください。このエリアで、文法が正しい文章をコピペした上で下のボタンを押してください！");

const responseLanguage = ref<string>(userOptions.responseLanguage);
const displayFurigana = ref<boolean>(userOptions.displayFurigana);
const particleIgnoreList = ref<Array<string>>(userOptions.particleIgnoreList);

const currentExplanation = ref("");
const LoadingExplanation = ref(false);
const analyzedTokens = ref<IpadicFeatures[]>([]);
const workingSplitTokens = ref<IpadicFeatures[][]>([]);
const workingSentenceIndex = ref<number>(0);

const markedStates = ref<Array<boolean>>([]);

const numberOfCorrectAnswers = ref<number>(0);
const totalNumberOfQuestions = computed(() => CountParticlesInSentences(workingSplitTokens.value, particleIgnoreList.value));
const setUserInputMode = (TextInput : UserInputMode) => {
  userInputMode.value = TextInput;
};

const setCurrentSentenceIndex = (newIndex : number) => {
  workingSentenceIndex.value = newIndex;
};

const setParticleIgnoreList = (newIgnoreList : Array<string>) => {
  particleIgnoreList.value = newIgnoreList;
  userOptions.particleIgnoreList = Array.from(newIgnoreList);
  PersistUserOptions(userOptions);
};

const setResponseLanguage = (newLanguage : string) => {
  clearResponsesCache(); //Clear the response cache when the language is changed.
  responseLanguage.value = newLanguage;
  userOptions.responseLanguage = newLanguage;
  PersistUserOptions(userOptions);
};

const setDisplayFurigana = (display : boolean) => {
  displayFurigana.value = display;
  userOptions.displayFurigana = display;
  PersistUserOptions(userOptions);
};

//Results Cache 
const ResultsCache = new Map<string, string>();
const GenerateCacheKey = (sentenceIndex : number, wordIndex : number, language : string) => {
  return `${wordIndex}-${sentenceIndex}-${language}`;
}
const clearResponsesCache = () => {
  ResultsCache.clear();
}

//Generation Explanation Function to be passed down to child components. 
const updateExplanation = async (wordIndex: number) => {

  const cacheKey = GenerateCacheKey(workingSentenceIndex.value, wordIndex, responseLanguage.value);
  const cached = getCachedExplanation(cacheKey);

  if (cached !== undefined) {
    currentExplanation.value = cached;
    return;
  }

  LoadingExplanation.value = true;

  const prompt = generatePrompt(wordIndex);
  const explanation = await fetchExplanation(prompt);

  setCachedExplanation(cacheKey, explanation);
  currentExplanation.value = explanation;
  LoadingExplanation.value = false;
};

const getCachedExplanation = (cacheKey: string): string | undefined => {
  return ResultsCache.get(cacheKey);
};
const setCachedExplanation = (cacheKey: string, explanation: string): void => {
  ResultsCache.set(cacheKey, explanation);
};
const generatePrompt = (wordIndex: number): string => {
  const guess = userInputs[workingSentenceIndex.value].get(wordIndex) ?? "";
  const correctAnswer = workingSplitTokens.value[workingSentenceIndex.value][wordIndex].surface_form;
  const allDisplayedStrings = workingSplitTokens.value[workingSentenceIndex.value].map((token) => token.surface_form);
  return GeneratePromptFromWrongAnswer(guess, correctAnswer, wordIndex, allDisplayedStrings, currentText.value, responseLanguage.value);
};
const fetchExplanation = async (prompt: string): Promise<string> => {
  return await LLM_API.sendPrompt(prompt);
};

//User Input State 
const clearMarkedStates = () => {
  markedStates.value = new Array<boolean>(workingSplitTokens.value.length).fill(false);
  numberOfCorrectAnswers.value = 0;
  clearResponsesCache();
}

//Event Handlers
const onMarkButtonClick = () => {
  markedStates.value[workingSentenceIndex.value] = true;
  numberOfCorrectAnswers.value = CountCorrectAnswers(workingSplitTokens.value[workingSentenceIndex.value], userInputs[workingSentenceIndex.value]);
}

const OnSubmitButtonClicked = () => {

  //Parse the Current Text and Split it into Sentences
  analyzedTokens.value = JapaneseParticleParser.parseJPText(currentText.value);
  workingSplitTokens.value = SplitTokensBySentences(analyzedTokens.value);

  //Reset Relevant Values;
  userInputs = Array.from({ length: workingSplitTokens.value.length }, () => new Map<number, string>());
  markedStates.value = new Array<boolean>(workingSplitTokens.value.length).fill(false);
  workingSentenceIndex.value = 0;
  numberOfCorrectAnswers.value = 0;
  clearResponsesCache();
  setUserInputMode("QuestionAnswering");
}

//Cleanup On Unmount
onUnmounted(() => {
  clearResponsesCache();
}); 

</script>

<template>
    <div class="container">
        <div class="panes">
          <div class="left-pane">
            <div v-if="userInputMode === `TextInput`" :class="'text-input-mode-container'">
              <textarea v-model="currentText" class="text-area"></textarea>
              <button @click="OnSubmitButtonClicked" class="submit-button">Submit</button>
            </div>
            <div v-if="userInputMode === 'QuestionAnswering'" :class="'question-answering-mode-container'">
              <SentenceCarousel 

                :class="'sentenceCarouselContainer'"
                :sentences="workingSplitTokens"
                :currentSentenceIndex="{value : workingSentenceIndex, set : setCurrentSentenceIndex}"
               
                :markedStates="markedStates"
                :userInputs="userInputs"
                :ignoredParticles="particleIgnoreList"
                :displayFurigana="displayFurigana"

                :onExplainButtonClicked="updateExplanation"
              />
              <button class="mark-button" @click="onMarkButtonClick">
                {{ 'Mark' }}
              </button>
            </div>
          </div>
          <div class="right-pane">
            <MarkDownRenderer class="markDownContainer" :markDownText="currentExplanation" :isLoading="LoadingExplanation"/>
            <Toolbox 

              :onReturnToTextInputClicked="() => setUserInputMode('TextInput')" 
              :onClearMarkedStatesClicked="clearMarkedStates"

              :selectedLanguage="{value : responseLanguage, set : setResponseLanguage}"
              :particleIgnoreList="{value : particleIgnoreList, set : setParticleIgnoreList}"
              :displayFurigana="{value : displayFurigana, set : setDisplayFurigana}"

              :correctAnswers="numberOfCorrectAnswers"
              :totalQuestions="totalNumberOfQuestions"
            />
          </div>
        </div>
    </div>
</template>

<style scoped>

.panes {
    display: flex;
    width: 100%;
    height: 100%;
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

.text-input-mode-container{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center vertically */
  align-items: center; /* Center horizontally */
}

.question-answering-mode-container{
  height: 100%;
  display: flex;
  flex-direction: column;
}

.text-area {
  width: 100%;
  height: 60vh;
  font-size: 32px;
  resize: none;
  color: white;
  background-color: #595858;
  flex: 39;
}

.submit-button { 
  width: 100%;
  background-color: #007BFF;
  color: white;
  border: none; 
  padding: 15px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  flex: 1
}

.submit-button:hover {
  background-color: #0056b3;
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