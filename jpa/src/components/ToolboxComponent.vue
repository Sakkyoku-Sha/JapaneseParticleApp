<script setup lang="ts">
import { ref, withDefaults, defineProps } from 'vue';
import { ResponseLanguages } from '@/LLM/ResponseLanguages';

import IgnoredParticleListComponent from './IgnoredParticleListComponent.vue';

const props = withDefaults(defineProps<{

  onReturnToTextInputClicked: () => void;
  onClearMarkedStatesClicked: () => void;

  selectedLanguage: {value : string, set : (language : string) => void};
  particleIgnoreList : {value : Array<string>, set : (newParticleIgnoreList : Array<string>) => void};
  displayFurigana : {value : boolean, set : (value : boolean) => void};  

  correctAnswers : number;
  totalQuestions : number;

}>(), {});

//Pop Up Screen for Ignored Particles 
const showIgnoreParticles = ref(false);

const onLanguageSelected = (event : Event) => {
  const value = (event.target as HTMLSelectElement).value;
  props.selectedLanguage.set(value);
}

const onIgnoredParticlesClicked = () => {
  showIgnoreParticles.value = true;
}

const onIgnoreParticleClosed = (newParticleIgnoreList : Array<string>) => {
  showIgnoreParticles.value = false;
  props.particleIgnoreList.set(newParticleIgnoreList);  
}

const onDisplayFuriganaClicked = (event : Event) => {
  const value = (event.target as HTMLInputElement).checked;
  props.displayFurigana.set(value);
}

</script>

<template>
    <div class="userOptions">
        <div class="option-group">
        <span>Language: </span>
        <select @change="onLanguageSelected">
            <option v-for="language in Object.values(ResponseLanguages)" :key="language" :value="language" :selected="selectedLanguage.value === language">
            {{ language }}
            </option>
        </select>
        </div>
        <div class="score-tally">
          Correct Answers: {{ correctAnswers }} / {{ totalQuestions }}
        </div>
        <div class = "display-furigana">
          <span>Display Furigana: </span>
          <input type="checkbox" id="displayFurigana" :checked="props.displayFurigana.value" @click="onDisplayFuriganaClicked"/>
        </div>
        <div class="option-group">
        <button @click="props.onReturnToTextInputClicked">Return to Text Input</button>
        <button @click="onClearMarkedStatesClicked">Clear Marked States</button>
        <button @click="onIgnoredParticlesClicked">Ignored Particles</button>
        </div>
        <IgnoredParticleListComponent 
          :is-visible="showIgnoreParticles" 
          :on-close="onIgnoreParticleClosed"
          :ignored-particles="Array.from(particleIgnoreList.value)"/>
    </div>
  
  
</template>

<style scoped>

.userOptions {
  flex: 3;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  width: 100%;
}

.userOptions {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.option-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.option-group select {
  padding: 5px;
  font-size: 16px;
}
button {
  padding: 10px 15px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

.score-tally {
  font-size: 18px;
  font-weight: bold;
}

.progress-bar-container {
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar {
  height: 20px;
  background-color: #76c7c0;
  width: 0;
  transition: width 0.3s ease;
}

</style>