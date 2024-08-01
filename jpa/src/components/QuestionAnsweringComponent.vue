<script setup lang="ts">
import SentenceCarousel from "@/components/SentenceCarousel.vue";
import MarkDownRenderer from "@/components/MarkDownRenderer.vue";

import {defineProps, withDefaults, computed, ref } from 'vue';
type QuestionAnsweringComponentProps = {
  userText: string;
  returnToTextInput: () => void;
};
const props = withDefaults(defineProps<QuestionAnsweringComponentProps>(), {});

//Japanese Parsing 
import {IsParticle, SplitTokensBySentences} from "@/parsing/KuromojiHelperFunctions";
import {JapaneseParticleParser} from "@/parsing/JapaneseParticleParser";
import {IpadicFeatures} from "kuromoji";

//Compute the Parsed Tokens
const analyzedTokens = computed(() => {
  return JapaneseParticleParser.parseJPText(props.userText);
});

//Organize the Tokens into Displayable Groupings.
const splitTokens = computed(() => {
  return SplitTokensBySentences(analyzedTokens.value);
});

//For now て and など create cases that are too difficult to guess. 
//By default we will ignore them. 
const particleIgnoreList = new Set(["て", "など"]);

const currentSentenceIndex = ref(0);
const updateSentence = (index: number) => {
    currentSentenceIndex.value = index;
};

//LLM Integration
import {GeneratePromptFromWrongAnswer} from "@/LLM/PromptGenerator";
import GPT_API from "@/LLM/CHATGPT_API";
const currentExplanation = ref("");
const LLM_API = new GPT_API(); 
const LoadingResponse = ref(false);

//Generation Explanation Function to be passed down to child components. 
const updateExplanation = async (baseToken : IpadicFeatures, guessIndex : number) => {

  //Set Loading State for Expression
  LoadingResponse.value = true;

  //Generate the Prompt
  const guess = userInputs.value[currentSentenceIndex.value].get(guessIndex) ?? "";
  const correctAnswer = baseToken.surface_form;
  const allDisplayedStrings = splitTokens.value[currentSentenceIndex.value].map((token) => token.surface_form);
  const prompt = GeneratePromptFromWrongAnswer(guess, correctAnswer, guessIndex, allDisplayedStrings, props.userText, selectedLang.value);
  
  //Execute the prompt; 
  const explanation = await LLM_API.sendPrompt(prompt);

  //Update ref value to cause UI to update. 
  currentExplanation.value = explanation;
  LoadingResponse.value = false;
}

//User Input State 
const marked = ref<Array<boolean>>(new Array<boolean>(splitTokens.value.length).fill(false));
const userInputs = ref<Array<Map<number, string>>>(new Array<Map<number, string>>(splitTokens.value.length).fill(new Map<number, string>()));
const selectedLang = ref<string>("日本語");

// const clearMarked = () =>{
//   marked.value = new Array<boolean>(splitTokens.value.length).fill(false);
// }
const onMarkButtonClick = () => {
  marked.value[currentSentenceIndex.value] = !marked.value[currentSentenceIndex.value];
}
const setUserInput = (index: number, value: string) => {
  if(userInputs.value[currentSentenceIndex.value] === undefined){
    userInputs.value[currentSentenceIndex.value] = new Map<number, string>();
  }
  userInputs.value[currentSentenceIndex.value].set(index, value);
}
const getUserInput = (index: number) => {
  return userInputs.value[currentSentenceIndex.value]?.get(index) ?? undefined;
}

const questionsCount = computed(() => {
  return splitTokens.value.map((sentence) => sentence).reduce((a, b) => IsParticle(b, ), 0);

})

const score  = computed(() => {
  const totalSentence = userInputs.value.length;
  let totalSentenceCorrect = 0;
  
  for(let i = 0; i < totalSentence; i++){
    userInputs.value[i].
  }



  return {totalScore : totalSentenceCorrect, totalQuestions : totalSentence};
});

</script>

<template>
    <div class="container">

        <div class="panes">
          <div class="left-pane">
            <SentenceCarousel class="sentenceCarouselContainer"
              :tokenArrays="splitTokens"
              :currentSentenceIndex="currentSentenceIndex"
              :marked="marked[currentSentenceIndex]"
              :updateExplanation="updateExplanation"
              :setUserInput="setUserInput"
              :getUserInput="getUserInput"
              :particleIgnoreList="particleIgnoreList"
              @update-sentence="updateSentence"/>
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