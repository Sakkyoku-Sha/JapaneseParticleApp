<script setup lang="ts">
import QuestionAnsweringComponent from "@/components/QuestionAnsweringComponent.vue";
import {ref, onMounted} from "vue"
import {JapaneseParticleParser} from "@/parsing/JapaneseParticleParser";

//Initialization of Global Data Structures. 
onMounted(async () => {
  await JapaneseParticleParser.Initialize();
});

const currentText = ref('この文章はただの例です。助詞を習うのが難しいので是非ともこのウェブサイトを利用してください。このエリアで、文法が正しい文章をコピペした上で下のボタンを押してください！');
const submitted = ref(false);

const submit = () => {submitted.value = true;};
const returnToTextInput = () => {submitted.value = false;};

</script>

<template>
  <div class="home-page">

    <div v-if="!submitted" class="main-content">
      <header class="header">
        <div class="title">文法チェカー</div>
      </header>
      <textarea v-model="currentText" class="text-area"></textarea>
    </div>

    <div v-else class="questions-screen">
      <QuestionAnsweringComponent :userText="currentText" :returnToTextInput="returnToTextInput"/>
    </div>
    
    <button @click="submit" class="submit-button">Submit</button>
  </div>
</template>

<style>
body {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  color: #333;
  background-color: #333;
}

.home-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #333;
}

.questions-screen {
  height: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #333;
  color: #fff;
  overflow: hidden;
}

.menu-item {
  margin-bottom: 10px;
}

.title {
  padding-left: 50px;
  font-size: 32px;
  font-weight: bold;
  color: #948f8f;
  margin: 20px 0;
  text-align: left;
}

.main-content {
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.text-area {
  width: 100%;
  height: 60vh;
  margin-bottom: 1px;
  border-radius: 4px;
  border: 1px solid #908888;
  padding: 10px;
  font-size: 32px;
  box-sizing: border-box;
  display: flex; /* Use flexbox */
  flex-direction: row;
  justify-content: center; /* Center vertically */
  align-items: center; /* Center horizontally */
  background-color: #948f8f;
}

.submit-button { 
  width: 60%;
  background-color: #007BFF;
  color: white;
  border: none; 
  padding: 15px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #0056b3;
}



</style>