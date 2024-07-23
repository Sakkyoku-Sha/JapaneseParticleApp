<template>
    <div class="carousel">
      <button @click="prevSentence">←</button>
      <span>{{ currentSentence }}</span>
      <button @click="nextSentence">→</button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  
  export default defineComponent({
    props: {
      sentences: {
        type: Array as PropType<string[]>,
        required: true,
      },
      currentSentenceIndex: {
        type: Number,
        required: true,
      },
    },
    methods: {
      prevSentence() {
        this.$emit('update-sentence', Math.max(this.currentSentenceIndex - 1, 0));
      },
      nextSentence() {
        this.$emit('update-sentence', Math.min(this.currentSentenceIndex + 1, this.sentences.length - 1));
      },
    },
    computed: {
      currentSentence(): string {
        return this.sentences[this.currentSentenceIndex];
      },
    },
  });
  </script>
  
  <style scoped>
  .carousel {
    display: flex;
    align-items: center;
  }
  button {
    margin: 0 10px;
  }
  </style>
  