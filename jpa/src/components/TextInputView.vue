<script setup lang="ts">
import { inject, computed } from "vue";
import { IpadicFeatures } from "kuromoji";
import { IsParticle } from "@/parsing/KuromojiHelperFunctions";
import { QuestionAnsweringComponentContextKey, QuestionAnsweringComponentContextType } from "./QuestionAnsweringComponent.vue";

const context = inject<QuestionAnsweringComponentContextType>(QuestionAnsweringComponentContextKey)!;
const workingSentenceIndex = context.workingSentenceIndex;
const workingSentenceMarked = computed(() => context.markedStates.value[workingSentenceIndex.value] === true);
const workingSentence = computed(() => context.workingSplitTokens[context.workingSentenceIndex.value]);
const particleIgnoreList = context.particleIgnoreList;
const setUserInput = context.setUserInput;
const getUserInput = context.getUserInput;
const updateExplanation = context.updateExplanation;

const onInputBlur = (event: FocusEvent, wordIndex: number) => {
  const target = event.target as HTMLInputElement;
  setUserInput(workingSentenceIndex.value, wordIndex, target.value);
};
const errorButtonClick = (token : IpadicFeatures, index: number) =>{
  updateExplanation(token, index);
}

const ShouldDisplayErrorButton = (wordIndex: number, token : IpadicFeatures) : boolean => {
  
  const userInput = getUserInput(workingSentenceIndex.value, wordIndex);
  
  return workingSentenceMarked.value === true &&
    userInput !== undefined && 
    userInput !== "" && 
    userInput !== token.surface_form; 
}
</script>

<template>
  <div class="TextInputView">
    <template v-for="(token, wordIndex) in workingSentence">
      <span v-if="!IsParticle(token, particleIgnoreList)" 
        :key="'display-' + wordIndex"
        :class="'non-particle-text'">
          {{ token.surface_form }}
      </span>
      <input v-else-if="workingSentenceMarked === false" 
        :key="'input-' + wordIndex"
        :value="getUserInput(workingSentenceIndex, wordIndex) || ''" 
        :class="'user-enterable-area '" 
        type="text"
        :maxlength="token.surface_form.length"
        :style="{ width: 32 * token.surface_form.length + 'px' }"
        @blur="onInputBlur($event, wordIndex)"/>
      <input v-else-if="workingSentenceMarked === true && getUserInput(workingSentenceIndex, wordIndex) === token.surface_form"
        :key="'correct' + wordIndex"
        :class="'user-enterable-area correct'"
        :readonly="true"
        :style="{ width: 32 * token.surface_form.length + 'px' }"
        type="text"
        :value="token.surface_form"/>
      
      <button v-else-if="ShouldDisplayErrorButton(wordIndex, token)"
        :key="'incorrectInput-' + wordIndex"   
        :class="'errorButton'"
        @click="errorButtonClick(token, wordIndex)">
        {{ getUserInput(workingSentenceIndex, wordIndex) }}
      </button>
      <span v-else 
        :key="'marked-noinput' + wordIndex"
        :class="'user-enterable-area incorrect'" 
        :style="{ width: 32 * token.surface_form.length + 'px' }">
        
      </span>
    </template>
  </div>
</template>

<style scoped>

.TextInputView {
  width: 100%;
  height: 100%;
  margin-bottom: 1px;
  padding: 10px;
  font-size: 32px;
  box-sizing: border-box;
  display: flex; /* Use flexbox */
  flex-direction: row;
  justify-content: center; /* Center vertically */
  align-items: left; /* Center horizontally */
  flex-wrap: wrap;
  align-content: center;
  row-gap: 20px;
}

.user-enterable-area{
  padding: 0;
  height: auto!important;
  border: none;
  background-color: inherit;
  font-size: 32px;
  color: white;
  height: 32px;
  margin-left: 5px;
  margin-right: 5px;
  border-bottom: 2px solid transparent; /* Fallback for older browsers */
  border-bottom: 2px solid white;
  border-image: repeating-linear-gradient(
    to right,
    white 0,
    white 28px,
    transparent 28px,
    transparent 32px
  ) 1;
}

.non-particle-text {
  text-wrap: nowrap;
}
.correct {
  color: #10d14d;
  border-image: repeating-linear-gradient(
    to right,
    #10d14d 0,
    #10d14d 28px,
    transparent 28px,
    transparent 32px
  ) 1;
}

.incorrect {
  
  color:#ff4d4d;
  border-image: repeating-linear-gradient(
    to right,
    #ff4d4d 0,
    #ff4d4d 28px,
    transparent 28px,
    transparent 32px
  ) 1;
}

.errorButton {
  width: 48px;
  background-color: #ff4d4d; /* Red background */
  border: none;
  border-radius: 5px; /* Rounded corners */
  color: white; /* White text */
  margin-left: 5px;
  margin-right: 5px;
  font-size: 16px; /* Font size */
  cursor: pointer; /* Pointer cursor on hover */
  box-shadow: 0 4px #d32f2f; /* 3D shadow effect */
  transition: background-color 0.3s, transform 0.1s; /* Smooth transitions */
  text-align: center; /* Center text */
}

.errorButton:hover {
  background-color: #ff6666; /* Slightly lighter red on hover */
}

.errorButton:active {
  background-color: #ff1a1a; /* Darker red when clicked */
  transform: translateY(4px); /* Depress effect */
  box-shadow: 0 2px #d32f2f; /* Adjust shadow to match depress effect */
}

</style>