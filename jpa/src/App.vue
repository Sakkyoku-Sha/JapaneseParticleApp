<script setup lang="ts">
import QuestionAnsweringComponent from "@/components/QuestionAnsweringComponent.vue";
import { JapaneseParticleParser } from "@/parsing/JapaneseParticleParser";
import HeaderComponent from "@/components/HeaderComponent.vue";
import { LoadUserOptions, PersistUserOptions } from "./persistance/PersistedUserOptions";
import { ref } from "vue";

// Fire and Forget this initialization on page load
JapaneseParticleParser.Initialize();

//Load globally used user options 
const userOptions = LoadUserOptions();
const responseLanguage = ref<string>(userOptions.responseLanguage);

const setResponseLanguage = (newLanguage : string) => {
  responseLanguage.value = newLanguage;
  userOptions.responseLanguage = newLanguage;
  PersistUserOptions(userOptions);
};

</script>

<template>
  <div class="app-container">
    <HeaderComponent  :selectedLanguage="{value : responseLanguage, set : setResponseLanguage}"/>
    <div class="questions-screen">
      <QuestionAnsweringComponent :responseLanguage="responseLanguage" />
    </div>
  </div>
</template>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
}
.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.questions-screen {
  flex: 1;
  background: #333;
  color: #fff;
  overflow: hidden;
}
</style>