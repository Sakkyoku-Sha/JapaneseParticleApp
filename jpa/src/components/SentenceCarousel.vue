<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref } from 'vue';
import { QuestionAnsweringComponentContextKey, QuestionAnsweringComponentContextType } from './QuestionAnsweringComponent.vue';
import TextInputView from './TextInputView.vue';

const context = inject<QuestionAnsweringComponentContextType>(QuestionAnsweringComponentContextKey)!
const workingSentenceIndex = context.workingSentenceIndex;
const workingSplitTokens = context.workingSplitTokens;
const updateWorkingSentence = context.updateWorkingSentence;

const isAnimating = ref(false);
const transitionName = ref('slide-left');

onMounted((() => {
  document.addEventListener('keydown', handleKeydown);
}));
onUnmounted((() => {
  document.removeEventListener('keydown', handleKeydown);
}));

const startAnimation = () => {
  isAnimating.value = true;
};
const stopAnimation = () => {
  isAnimating.value = false;
};

const handleKeydown = (event: KeyboardEvent) => {
    if (isAnimating.value) {return;}

    if (event.key === 'ArrowLeft') {
        prevSentence();
    } else if (event.key === 'ArrowRight') {
        nextSentence();
    }
};

const prevSentence = () => {
  transitionName.value = 'slide-left';
  updateWorkingSentence(Math.max(workingSentenceIndex.value - 1, 0));
};
const nextSentence = () => {
  transitionName.value = 'slide-right';
  updateWorkingSentence(Math.min(workingSentenceIndex.value + 1, workingSplitTokens.length - 1));
};
</script>

<template>
  <div class="carousel">

    <div class="CarouselButtonContainer">
      <button v-if="(workingSentenceIndex > 0)" class="triangle-button left" @click="prevSentence"></button>
    </div>
    <transition mode="out-in" :name="transitionName" @before-enter="startAnimation" @after-leave="stopAnimation">
      <TextInputView :key="workingSentenceIndex" class="TextInputViewContainer" style="width: 90%;"/>
    </transition>
    <div class="CarouselButtonContainer">
      <button v-if="(workingSentenceIndex < workingSplitTokens.length - 1)" class="triangle-button right" @click="nextSentence"></button>
    </div>
    
  </div>
</template>

<style scoped>

.carousel {
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
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
  overflow: hidden;
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

.slide-left-enter-active, .slide-left-leave-active {
  transition: transform 0.5s;
}
.slide-left-enter-from{
  transform: translateX(-100%);
}
.slide-left-leave-to{
  transform: translateX(100%);
}

.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.5s;
}
.slide-right-enter-from{
  transform: translateX(100%);
}
.slide-right-leave-to{
  transform: translateX(-100%);
}


</style>
