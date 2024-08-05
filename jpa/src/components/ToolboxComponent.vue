<script setup lang="ts">
import { inject, computed, ref, withDefaults, defineProps } from 'vue';
import { ResponseLanguages } from '@/LLM/ResponseLanguages';
import { QuestionAnsweringComponentContextKey, QuestionAnsweringComponentContextType } from './QuestionAnsweringComponent.vue';
import { CountParticlesInSentences } from '@/parsing/KuromojiHelperFunctions';

import IgnoredParticleListComponent from './IgnoredParticleListComponent.vue';

const props = withDefaults(defineProps<{
  returnToTextInputClicked: () => void;
  clearMarkedStatesClicked: () => void;
  onLanguageSelected: (responseLanguage : string) => void;
  responseLanguage: string;
}>(), {});

const context = inject<QuestionAnsweringComponentContextType>(QuestionAnsweringComponentContextKey)!
const workingSplitTokens = context.workingSplitTokens;
const particleIgnoreList = context.particleIgnoreList
const markedStates = context.markedStates;
const getUserInput = context.getUserInput;
const updateParticleIgnoreList = context.updateParticleIgnoreList;

const showIgnoreParticles = ref(false);

//Derived Values for UI 
const totalNumberOfQuestions = computed(() => {
  return CountParticlesInSentences(workingSplitTokens, particleIgnoreList.value);
})

const totalQuestionsCorrect = computed(() => {
  
  let totalCorrect = 0;
  
  for(let i = 0; i < markedStates.value.length; i++){
    
    if(markedStates.value[i] === true){
      const markedSentence = workingSplitTokens[i]; 

      for(let j = 0; j < markedSentence.length; j++){
        const token = markedSentence[j];
        const userInput = getUserInput(i,j) ?? "";
        if(particleIgnoreList.value.has(token.surface_form) === false && token.surface_form === userInput){
          totalCorrect++;
        }
      }
      
    }
  }

  return totalCorrect;
});

const progressRatio = computed(() => {
  const numberMarked = markedStates.value.filter((value) => value === true).length;
  return numberMarked / totalNumberOfQuestions.value;
})


const onLanguageSelected = (event : Event) => {
  const value = (event.target as HTMLSelectElement).value;
  props.onLanguageSelected(value);
}

const onIgnoredParticlesClicked = () => {
  showIgnoreParticles.value = true;
}

const onIgnoreParticleClosed = (newParticleIgnoreList : Array<string>) => {
  showIgnoreParticles.value = false;
  updateParticleIgnoreList(new Set<string>(newParticleIgnoreList));  
}

</script>

<template>
    <div class="userOptions">
        <div class="option-group">
        <span>Language: </span>
        <select @change="onLanguageSelected">
            <option v-for="language in Object.values(ResponseLanguages)" :key="language" :value="language" :selected="responseLanguage === language">
            {{ language }}
            </option>
        </select>
        </div>
        <div class="option-group">
        <button @click="props.returnToTextInputClicked">Return to Text Input</button>
        <button @click="clearMarkedStatesClicked">Clear Marked States</button>
        <button @click="onIgnoredParticlesClicked">Ignored Particles</button>
        </div>
        <div class="score-tally">
          Correct Answers: {{ totalQuestionsCorrect }} / {{ totalNumberOfQuestions }}
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar" :style="{ width: progressRatio * 100 + '%' }"></div>
        </div>
        <IgnoredParticleListComponent 
          :is-visible="showIgnoreParticles" 
          :on-close="onIgnoreParticleClosed"
          :ignored-particles="Array.from(particleIgnoreList)"/>
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