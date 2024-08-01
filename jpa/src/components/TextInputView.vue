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
      <span v-else-if="workingSentenceMarked === true && getUserInput(workingSentenceIndex, wordIndex) === token.surface_form"
        :key="'correctInput-' + wordIndex"
        :class="'uneditable-area correct'"
        type="text">
        {{ token.surface_form }}
      </span>
      <button v-else-if="ShouldDisplayErrorButton(wordIndex, token)"
        :key="'incorrectInput-' + wordIndex"   
        :class="'errorButton incorrect'"
        @click="errorButtonClick(token, wordIndex)">
        {{ getUserInput(workingSentenceIndex, wordIndex) }}
      </button>
      <span v-else
        :key="'uneditable-' + wordIndex"
        :class="'uneditable-area'"
        type="text">
        {{ token.surface_form }}
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
  justify-content: left; /* Center vertically */
  align-items: left; /* Center horizontally */
  flex-wrap: wrap;
  align-content: center;
}

.non-particle-text {
  text-wrap: nowrap;
}
.correct {
  background-color: #10d14d;
}

.incorrect {
  background-color: #d11010;
}

</style>