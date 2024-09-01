<script setup lang="ts">
//Vue Imports 
import {ref, computed, onUnmounted, onMounted, defineProps, withDefaults, watch} from 'vue';

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
import {RequestExplanation} from "@/LLM/LLM_API";

//User Settings 
import {LoadUserOptions, PersistUserOptions} from "@/persistance/PersistedUserOptions";
import { CountCorrectAnswers } from '@/utils/CountCorrectAnswers';

//Props 
const props = withDefaults(defineProps<{
  responseLanguage : string;
}>(), {});

//Local Types 
type UserInputMode = "TextInput" | "QuestionAnswering";
var userInputs = new Array<Map<number, string>>();

//Reactivity Variables
const userInputMode = ref<UserInputMode>("TextInput"); 
const currentText = ref<string>("このエリアで、文法が正しい文章をコピペした上で下のボタンを押してください！");

const userOptions = LoadUserOptions();
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

//Clear Cache on Language Change 
watch(() => props.responseLanguage, (newVal, oldVal) => {
  if(newVal !== oldVal){
    clearResponsesCache();
  }
});

//Generation Explanation Function to be passed down to child components. 
const updateExplanation = async (wordIndex: number) => {

  const cacheKey = GenerateCacheKey(workingSentenceIndex.value, wordIndex, props.responseLanguage);
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
  return GeneratePromptFromWrongAnswer(guess, correctAnswer, wordIndex, allDisplayedStrings, currentText.value, props.responseLanguage);
};
const fetchExplanation = async (prompt: string): Promise<string> => {
  return await RequestExplanation(prompt);
};

//User Input State 
const clearMarkedStates = () => {
  markedStates.value = new Array<boolean>(workingSplitTokens.value.length).fill(false);
  numberOfCorrectAnswers.value = 0;
  clearResponsesCache();
}

//Event Handlers
const markCurrentSentence = () => {
  markedStates.value[workingSentenceIndex.value] = true;
  numberOfCorrectAnswers.value = CountCorrectAnswers(workingSplitTokens.value[workingSentenceIndex.value], userInputs[workingSentenceIndex.value]);
}
const unMarkCurrentSentence = () => {
  markedStates.value[workingSentenceIndex.value] = false;
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

onMounted((() => {
  document.addEventListener('keydown', handleKeydown);
}));
onUnmounted((() => {
  document.removeEventListener('keydown', handleKeydown);
}));

const handleKeydown = (event: KeyboardEvent) => {
  if (userInputMode.value === "QuestionAnswering") {
    if (event.key === 'Enter') {
      markCurrentSentence();
    }
    if(event.key === 'Backspace'){
      unMarkCurrentSentence();
    }
  }
};

</script>

<template>
    <div class="container">
        <div class="panes">
          <div class="left-pane">
            <div v-if="userInputMode === `TextInput`" :class="'text-input-mode-container'">
              <div class="text-area-container">
                <textarea v-model="currentText" class="text-area"></textarea>
              </div>
              <div class="explanation-area">
                <div class="explanation-area-container">
                  <p>How to use:</p>
                  <ul>
                    <li>Paste in Japanese text above, for example articles from <a href="https://www3.nhk.or.jp/news/" target="_blank">NHK News</a>.</li>
                    <li>Click the Submit button below.</li>
                    <li>Type in the correct particles in the blank spaces on the following page.</li>
                    <li>Press Enter or click Submit to mark your answers.</li>
                    <li>Click on wrong answers for an explanation of why the answer is incorrect.</li>
                  </ul>
                </div>
              </div>
              <div class="submit-button-container">
                <button @click="OnSubmitButtonClicked" class="submit-button">Submit</button>
              </div>
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
              <button class="mark-button" @click="markCurrentSentence">
                {{ 'Mark' }}
              </button>
            </div>
          </div>
          <div class="right-pane">
            <div class="explanation-container">
              <MarkDownRenderer class="markDownContainer" :markDownText="currentExplanation" :isLoading="LoadingExplanation"/>
            </div>
           
            <Toolbox 

              :onReturnToTextInputClicked="() => setUserInputMode('TextInput')" 
              :onClearMarkedStatesClicked="clearMarkedStates"

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
  flex: 8;
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
  font-size: 32px;
  resize: none;
  color: white;
  background-color: #595858;
  height: 90%;
  width: 90%;
}

.text-area-container {
  width: 100%;
  height: 100%;
  flex: 15;
  text-align: center;
  align-content: center;
}

.explanation-area {
  flex: 10;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
}

.explanation-area-container {
  font-size: 24px;
  line-height: 1.5;
  height: 100%;
}

.submit-button { 
  width: 90%;
  height: 60%;
  background-color: #007BFF;
  color: white;
  border: none; 
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.submit-button-container {
  flex: 4;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
  flex: 4;
  display: flex;
  flex-direction: column;
  background-color: #322f2f;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.explanation-container {
  width: 100%;
  height: 100%;
  flex: 7;
  display: flex;
  justify-content: center;
}

.markDownContainer {
  width: 95%;
  height: 95%;
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