<!-- Must Define a non script setup area to define a type which is exported-->
<script lang="ts">
//Defined Components 
import SentenceCarousel from "@/components/SentenceCarousel.vue";
import MarkDownRenderer from "@/components/MarkDownRenderer.vue";

//Vue Imports 
import {defineProps, withDefaults, computed, ref, provide, Ref } from 'vue';

//Japanese Parsing 
import {SplitTokensBySentences} from "@/parsing/KuromojiHelperFunctions";
import {JapaneseParticleParser} from "@/parsing/JapaneseParticleParser";
import { IpadicFeatures } from "kuromoji";

//LLM Integration
import {GeneratePromptFromWrongAnswer} from "@/LLM/PromptGenerator";
import GPT_API from "@/LLM/CHATGPT_API";

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

//For now て and など create cases that are too difficult to guess. 
//By default we will ignore them. 
const particleIgnoreList = ref(new Set(["て", "など"]));

//LLM Integration
const currentExplanation = ref("");
const LLM_API = new GPT_API(); 
const LoadingResponse = ref(false);

//Generation Explanation Function to be passed down to child components. 
const updateExplanation = async (baseToken : IpadicFeatures, guessIndex : number) => {

  //Set Loading State for Expression
  LoadingResponse.value = true;

  //Generate the Prompt
  const guess = userInputs.value[workingSentenceIndex.value].get(guessIndex) ?? "";
  const correctAnswer = baseToken.surface_form;
  const allDisplayedStrings = workingSplitTokens.value[workingSentenceIndex.value].map((token) => token.surface_form);
  const prompt = GeneratePromptFromWrongAnswer(guess, correctAnswer, guessIndex, allDisplayedStrings, props.userText, selectedLang.value);
  
  //Execute the prompt; 
  const explanation = await LLM_API.sendPrompt(prompt);

  //Update ref value to cause UI to update. 
  currentExplanation.value = explanation;
  LoadingResponse.value = false;
}

//User Input State 
const workingSentenceIndex = ref(0);
const updateWorkingSentence = (sentenceIndex: number) => {
    workingSentenceIndex.value = sentenceIndex;
};

const markedStates = ref<Array<boolean>>(new Array<boolean>(workingSplitTokens.value.length).fill(false));
const userInputs = ref<Array<Map<number, string>>>(new Array<Map<number, string>>(workingSplitTokens.value.length).fill(new Map<number, string>()));
const selectedLang = ref<string>("日本語");

// const clearMarked = () =>{
//   marked.value = new Array<boolean>(splitTokens.value.length).fill(false);
// }
const onMarkButtonClick = () => {
  markedStates.value[workingSentenceIndex.value] = !markedStates.value[workingSentenceIndex.value];
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
              <span>Language: </span>
              <select v-model="selectedLang">
                <option value="日本語">日本語</option>
                <option value="English">English</option>
                <option value="中国">中国</option>
              </select>
              <button @click="props.returnToTextInput">Return to Text Input</button>
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
  border-right: 1px solid #ccc; /* Optional: Add a border for separation */
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
  flex: 3; /* 30% width */
  margin-top: 10px;
  height: 100%;
}

.markDownContainer {
  width: 100%;
  height: 70%;
  overflow: auto;
  max-height: fit-content;
}

.userOptions {
  border: #ccc 1px solid;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  height: 30%;
  width: 100%;

}
</style>