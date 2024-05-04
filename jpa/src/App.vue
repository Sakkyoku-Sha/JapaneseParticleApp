<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <input type="text" v-model="inputRef">
  <button @click="logInput">Log Input</button>
</template>

<script lang="ts">

import { ref } from 'vue';
import JapaneseParticleParser from './parsing/JapaneseParticleParser';

const parser = new JapaneseParticleParser();

export default {
  setup() {
    const inputRef = ref('');
    
    function logInput() {
      const result = parser.parseJPText(inputRef.value);
      console.log(result);
    }

    return {
      inputRef,
      logInput
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
