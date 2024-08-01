<script setup lang="ts">
import { defineProps, defineEmits, computed, withDefaults } from 'vue';
import { IpadicFeatures } from 'kuromoji';
import TextInputView from './TextInputView.vue';

type SentenceCarouselProps = {
  tokenArrays: IpadicFeatures[][];
  currentSentenceIndex: number;
  marked : boolean;
  particleIgnoreList: Set<string>;
  updateExplanation: (baseToken: IpadicFeatures, guessIndex: number) => void;
  setUserInput(index: number, value: string): void;
  getUserInput(index: number): string | undefined;
};

const props = withDefaults(defineProps<SentenceCarouselProps>(), {});

const emit = defineEmits<{
  (event: 'update-sentence', index: number): void;
}>();

const prevSentence = () => {
  emit('update-sentence', Math.max(props.currentSentenceIndex - 1, 0));
};
const nextSentence = () => {
  emit('update-sentence', Math.min(props.currentSentenceIndex + 1, props.tokenArrays.length - 1));
};

const currentSentence = computed(() => props.tokenArrays[props.currentSentenceIndex]);

</script>

<template>
  <div class="carousel">
    <div style="width: 5%">
      <button v-if="(props.currentSentenceIndex > 0)" class="triangle-button left" @click="prevSentence"></button>
    </div>
   
    <TextInputView style="width: 90%;" 
      :analyzedTokens="currentSentence" 
      :marked="props.marked"
      :particleIgnoreList="props.particleIgnoreList"
      :updateExplanation="props.updateExplanation"
      :setUserInput="props.setUserInput"
      :getUserInput="props.getUserInput"/>

      <div style="width: 5%">
        <button v-if="(props.currentSentenceIndex < props.tokenArrays.length - 1)" class="triangle-button right" @click="nextSentence"></button>
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
