<script setup lang="ts">
import { inject, computed } from 'vue';
import { QuestionAnsweringComponentContextKey, QuestionAnsweringComponentContextType } from './QuestionAnsweringComponent.vue';
import TextInputView from './TextInputView.vue';

const context = inject<QuestionAnsweringComponentContextType>(QuestionAnsweringComponentContextKey)!
const workingSentenceIndex = context.workingSentenceIndex;
const workingSplitTokens = context.workingSplitTokens;
const updateWorkingSentence = context.updateWorkingSentence;

const currentSentenceMarked = computed(() => {
  return context.markedStates.value[workingSentenceIndex.value];
});

const prevSentence = () => {
  updateWorkingSentence(Math.max(workingSentenceIndex.value - 1, 0));
};
const nextSentence = () => {
  updateWorkingSentence(Math.min(workingSentenceIndex.value + 1, workingSplitTokens.length - 1));
};
</script>

<template>
  <div class="carousel">

    <div class="CarouselButtonContainer">
      <button v-if="(workingSentenceIndex > 0)" class="triangle-button left" @click="prevSentence"></button>
    </div>

    <div class="QuestionTextAreaContainer">

      <div class="AnswerAreaContainer">
        <div v-if = "currentSentenceMarked" class="AnswerArea">
          <span class="AnswerAreaText">Answered</span>
        </div>
      </div>

      <TextInputView class="TextInputViewContainer" style="width: 90%;"/>
      
      <div class="BufferArea"></div>
    

    </div>
    <div class="CarouselButtonContainer">
      <button v-if="(workingSentenceIndex < workingSplitTokens.length - 1)" class="triangle-button right" @click="nextSentence"></button>
    </div>
    
  </div>
</template>

<style scoped>

.carousel {
  display: flex;
  align-items: center;
}
button {
  margin: 0 10px;
}

.QuestionTextAreaContainer{
  width: 90%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.CarouselButtonContainer{
  width: 5%;
}

.AnswerAreaContainer{
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 5;
  width: 90%;
}

.TextInputViewContainer{
  width: 100%;
  flex: 6;
}

.BufferArea{
  flex: 5;
}

.triangle-button {
  background: transparent;
  border: none;
  cursor: pointer;
  width: 0;
  height: 0;
  border-style: solid;
}

.triangle-button.left {
  border-width: 20px 30px 20px 0;
  border-color: transparent #8a8c8e transparent transparent;
}

.triangle-button.right {
  border-width: 20px 0 20px 30px;
  border-color: transparent transparent transparent #8a8c8e;
}

.triangle-button:hover {
  border-color: transparent #eef2f5 transparent transparent;
}

.triangle-button.right:hover {
  border-color: transparent transparent transparent #eef2f5;
}

.triangle-button:active {
  border-color: transparent #484a4c transparent transparent;
}

.triangle-button.right:active {
  border-color: transparent transparent transparent #484a4c;
}
</style>
