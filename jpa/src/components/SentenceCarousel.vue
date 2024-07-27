<script setup lang="ts">
import { defineProps, defineEmits, computed, withDefaults } from 'vue';
import { IpadicFeatures } from 'kuromoji';
import TextInputView from './TextInputView.vue';

type SentenceCarouselProps = {
  tokenArrays: IpadicFeatures[][];
  currentSentenceIndex: number;
  marked : boolean;
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
    <button @click="prevSentence">←</button>
    
    <TextInputView 
      :analyzedTokens="currentSentence" 
      :marked="props.marked"
      :updateExplanation="props.updateExplanation"
      :setUserInput="props.setUserInput"
      :getUserInput="props.getUserInput"/>

    <button @click="nextSentence">→</button>
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
</style>
