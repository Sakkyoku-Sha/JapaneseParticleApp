<script setup lang="ts">
import QuestionAnsweringComponent from "@/components/QuestionAnsweringComponent.vue";
import {JapaneseParticleParser} from "@/parsing/JapaneseParticleParser";

//Fire and Forget this initalization on page load
JapaneseParticleParser.Initialize();

</script>

<template>
  <div class="questions-screen">
    <QuestionAnsweringComponent/>
  </div>
</template>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}


#app{
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
}

.questions-screen {
  height: 100%;
  width: 100%;
  background: #333;
  color: #fff;
  overflow: hidden;
}

.title {
  padding-left: 50px;
  font-size: 32px;
  font-weight: bold;
  color: #948f8f;
  margin: 20px 0;
  text-align: left;
}
</style>