<script setup lang="ts">
import { defineProps, defineEmits, computed, withDefaults } from 'vue';
import { IpadicFeatures } from 'kuromoji';
import TextInputView from './TextInputView.vue';

type SentenceCarouselProps = {
  tokenArrays: IpadicFeatures[][];
  currentSentenceIndex: number;
};
const props = withDefaults(defineProps<SentenceCarouselProps>(), {});

const emit = defineEmits(['update-sentence']);

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
    <TextInputView :analyzedTokens="currentSentence"/>
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
