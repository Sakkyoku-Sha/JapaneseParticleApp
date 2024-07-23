<template>
    <div>
      <p v-for="(sentence, index) in sentences" :key="index" :class="{ highlighted: index === currentSentenceIndex }">
        {{ sentence }}
      </p>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  
  export default defineComponent({
    props: {
      article: {
        type: String,
        required: true,
      },
      currentSentenceIndex: {
        type: Number,
        required: true,
      },
    },
    computed: {
      sentences(): string[] {
        return this.article.split('.').map(sentence => sentence.trim() + '.');
      },
    },
  });
  </script>
  
  <style scoped>
  .highlighted {
    background-color: yellow;
  }
  </style>
  