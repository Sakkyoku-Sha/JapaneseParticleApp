<script setup lang="ts">
import SentenceCarousel from "@/components/SentenceCarousel.vue";
import MarkDownRenderer from "@/components/MarkDownRenderer.vue";

import {defineProps, withDefaults, computed, ref } from 'vue';
type QuestionAnsweringComponentProps = {
  userText: string;
};
const props = withDefaults(defineProps<QuestionAnsweringComponentProps>(), {});

//Japanese Parsing 
import {SplitTokensBySentences} from "@/parsing/KuromojiHelperFunctions";
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

const currentSentenceIndex = ref(0);
const updateSentence = (index: number) => {
      currentSentenceIndex.value = index;
};

//LLM Integration
import {GeneratePromptFromWrongAnswer} from "@/LLM/PromptGenerator";
import GPT_API from "@/LLM/CHATGPT_API";
const currentExplanation = ref("");
const LLM_API = new GPT_API(); 

//Generation Explanation Function to be passed down to child components. 
const updateExplanation = async (baseToken : IpadicFeatures, guessIndex : number) => {

  //Generate the Prompt
  const guess = userInputs.value[currentSentenceIndex.value].get(guessIndex) ?? "";
  const correctAnswer = baseToken.surface_form;
  const allDisplayedStrings = splitTokens.value[currentSentenceIndex.value].map((token) => token.surface_form);
  const prompt = GeneratePromptFromWrongAnswer(guess, correctAnswer, guessIndex, allDisplayedStrings, props.userText);
  
  //Execute the prompt; 
  const explanation = await LLM_API.sendPrompt(prompt);

  //Update ref value to cause UI to update. 
  currentExplanation.value = explanation;
}

//User Input State 
const marked = ref<boolean>(true);
const userInputs = ref<Array<Map<number, string>>>(new Array<Map<number, string>>(splitTokens.value.length));


const OnMarkButtonClick = () => {
  marked.value = !marked.value;
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

</script>

<template>
    <div class="container">

        <div class="panes">
          <div class="left-pane">
            <SentenceCarousel style="height: 100%;"
              :tokenArrays="splitTokens"
              :currentSentenceIndex="currentSentenceIndex"
              :marked="marked"
              :updateExplanation="updateExplanation"
              :setUserInput="setUserInput"
              :getUserInput="getUserInput"
              @update-sentence="updateSentence"/>
          </div>
          <div class="right-pane">
            <MarkDownRenderer :markDownText="currentExplanation"/>
          </div>
        </div>
        
        <button class="mark-button" @click="OnMarkButtonClick">
          {{ 'Mark' }}
        </button>
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
}

.right-pane {
  flex: 3; /* 30% width */
  padding: 10px 10px 10px 10px; /* Optional: Add some padding */
  margin: 10px 10px 10px 10px;
  height: 100%;
}

.mark-button { 
  width: 100%;
  background-color: #10d14d;
  color: white;
  border: none; 
  padding: 15px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.mark-button:hover {
  background-color: #037d40;
}
</style>