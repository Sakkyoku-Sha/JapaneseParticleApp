<script setup lang="ts">

import {marked} from 'marked';
import {defineProps, computed, withDefaults} from 'vue';

type MarkDownRendererProps = {
  markDownText: string;
  isLoading? : boolean;
};
const props = withDefaults(defineProps<MarkDownRendererProps>(), {
  isLoading : false,
});

const parsedContent = computed(() => marked(props.markDownText));

</script>

<template>
  <div class="markdown-renderer">
    <div class="loading-screen" v-if="props.isLoading">
      <div class="spinner"></div>
    </div>
    <div v-else v-html="parsedContent"></div>
  </div>
</template>

<style>
.markdown-renderer {
  position: relative; /* Ensure the loading screen is positioned relative to this container */
  height: 100%;
}

.loading-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* Full height of the parent container */
  width: 100%; /* Full width of the parent container */
  background-color: inherit; /* Semi-transparent background */
  position: relative; /* Position absolutely within the parent container */
  top: 0;
  left: 0;
  z-index: 1000; /* Ensure it covers other content within the parent container */
}

.spinner {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>