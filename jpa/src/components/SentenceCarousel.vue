<script setup lang="ts">
import InputView from './InputView.vue';
import { onMounted, onUnmounted, ref, defineProps, withDefaults, computed } from 'vue';
import { IpadicFeatures } from 'kuromoji';
import { CreateInputViewDefinition } from '@/utils/InputViewDefinitionGeneration';

const props = withDefaults(defineProps<{
  sentences : IpadicFeatures[][],
  currentSentenceIndex : {value : number, set : (index : number) => void};

  markedStates : boolean[];
  userInputs : Map<number, string>[];  
  ignoredParticles? : string[];
  displayFurigana? : boolean;
  
  onExplainButtonClicked? : (wordIndex : number) => void
}>(), {});

const workingSentence = computed(() => props.sentences[props.currentSentenceIndex.value]);
const markedState = computed(() => props.markedStates[props.currentSentenceIndex.value]);

const onInputChanged = (wordIndex : number, value : string) => {
    props.userInputs[props.currentSentenceIndex.value].set(wordIndex, value);
};  
const getUserInput = (indexInSentence : number) => {
    return props.userInputs[props.currentSentenceIndex.value].get(indexInSentence) ?? undefined;
};
const currentInputViewDefinition = computed(() => {
  return CreateInputViewDefinition(workingSentence.value, markedState.value, getUserInput, props.onExplainButtonClicked, onInputChanged, props.ignoredParticles, props.displayFurigana);
}); 

const dots = computed(() => {
  if(props.sentences.length < 2){
    return [];
  }
  return props.sentences.map((_, index) => ({
    index,
    isActive: index === props.currentSentenceIndex.value
  }));
});

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
  props.currentSentenceIndex.set(Math.max(props.currentSentenceIndex.value - 1, 0));
};
const nextSentence = () => {
  transitionName.value = 'slide-right';
  props.currentSentenceIndex.set(Math.min(props.currentSentenceIndex.value + 1, props.sentences.length - 1));
};
const goToSentence = (index: number) => {
  if(index < props.currentSentenceIndex.value){
    transitionName.value = 'slide-left';
  }
  else{
    transitionName.value = 'slide-right';
  }
  props.currentSentenceIndex.set(index);
};
</script>

<template>
  <div class="carousel">

    <div class="CarouselButtonContainer">
      <button v-if="(currentSentenceIndex.value > 0)" class="triangle-button left" @click="prevSentence"></button>
    </div>
    <div class="carousel-content-container">
      <div class="top-padding"/>
      <transition mode="out-in" :name="transitionName" @before-enter="startAnimation" @after-leave="stopAnimation">
        <InputView 
          :key="currentSentenceIndex.value" 
          :definitions="currentInputViewDefinition"
          class="TextInputViewContainer" 
          style="width: 90%;" />
      </transition>
      <div class="carousel-dots">
        <span
          v-for="dot in dots"
          :key="dot.index"
          :class="{ 'dot': true, 'active': dot.isActive }"
          @click="goToSentence(dot.index)">
      </span>
    </div>  
    </div>
   
    <div class="CarouselButtonContainer">
      <button v-if="(currentSentenceIndex.value < sentences.length - 1)" class="triangle-button right" @click="nextSentence"></button>
    </div>
    
  </div>
</template>

<style scoped>

.carousel {
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;;
}

.carousel-content-container{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  height: 100%;
  flex:3
}
.carousel-content-container{
  display: flex;
  flex-direction: column;
}
.top-padding{
  flex: 3;
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
  transition: transform 0.4s;
}
.slide-left-enter-from{
  transform: translateX(-100%);
}
.slide-left-leave-to{
  transform: translateX(100%);
}

.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.4s;
}
.slide-right-enter-from{
  transform: translateX(100%);
}
.slide-right-leave-to{
  transform: translateX(-100%);
}

.carousel-dots {
  flex: 3;
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.dot {
  width: 10px;
  height: 10px;
  margin: 0 5px;
  background-color: #544f4f;
  border-radius: 50%;
  cursor: pointer;
}
.dot.active {
  background-color: white;
}

</style>
