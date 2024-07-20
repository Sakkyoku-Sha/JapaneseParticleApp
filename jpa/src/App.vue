<script setup lang="ts">
import TextInputView from "@/components/TextInputView.vue";
import MarkDownRenderer from "@/components/MarkDownRenderer.vue";

import {ref} from "vue"
import {JapaneseParticleParser} from "@/parsing/JapaneseParticleParser";
import {IpadicFeatures} from "kuromoji";

const currentText = ref('');
const submitted = ref(false);
const analyzedTokens = ref([] as IpadicFeatures[]);

const submit = () => {      
    analyzedTokens.value = JapaneseParticleParser.parseJPText(currentText.value);
    submitted.value = true;
};

const returnClick = () => {
    submitted.value = false;
};

const testText = "In Japanese, both が (ga) and は (wa) are particles used to mark the subject of a sentence, but they have different functions and implications.\n\n### が (ga)\n- **Function**: が is typically used to indicate a specific subject or to highlight a new piece of information. It can introduce something that has not been previously mentioned in the conversation.\n- **Usage**:\n  - When identifying or focusing on what or who is performing an action: \n    - Example: 彼が学生です。 (Kare ga gakusei desu.) - \"He is a student.\"\n  - When distinguishing among different subjects:\n    - Example: 猫が好きです。 (Neko ga suki desu.) - \"I like cats.\" (Here, が emphasizes that it is cats that I like, possibly contrasting them with other animals.)\n  \n### は (wa)\n- **Function**: は indicates a general topic of conversation and can be translated as \"as for\" or \"regarding.\" It serves to provide a broader context or to set the stage for what follows.\n- **Usage**:\n  - When introducing a topic for discussion:\n    - Example: 彼は学生です。 (Kare wa gakusei desu.) - \"As for him, he is a student.\" (This suggests that you might be discussing him among other topics or people.)\n  - When contrasting subjects:\n    - Example: 猫は好きですが、犬は嫌いです。 (Neko wa suki desu ga, inu wa kirai desu.) - \"I like cats, but I dislike dogs.\" (Here, は emphasizes the contrast.)\n\n### Summary\n- Use **が** for specific identification or introducing new information.\n- Use **は** to generalize or discuss a topic, often in a broader context.\n\nUnderstanding the difference between these two particles can significantly impact the nuance of sentences in Japanese, so it's worthwhile to pay attention to their usage in context.";

</script>


<template>
  <div class="home-page">
    <header class="header">
      <div class="title">文法チェカー</div>
    </header>
    
    <main v-if="!submitted" class="main-content">
      <textarea v-model="currentText" class="text-area"></textarea>
      <button @click="submit" class="submit-button">Submit</button>
    </main>
    <div v-else class="hamburger-menu">
      <TextInputView :analyzedTokens="analyzedTokens"/>
      <button @click="returnClick" class="submit-button">Return</button>
    </div>
    <MarkDownRenderer :markDownText="testText" />
  </div>
</template>

<style>
body {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  color: #333;
}

.hamburger-menu {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #333;
  color: #fff;
  padding: 20px;
}

.menu-item {
  margin-bottom: 10px;
}

/* .slide-enter-active, .slide-leave-active {
  transition: all 1s ease;
}

.slide-enter {
  transform: translateY(100%);
}

.slide-enter-to, .slide-leave {
  transform: translateY(0);
  overflow: hidden;
}

.slide-leave-to {
  transform: translateY(100%);
} */

.title {
  padding-left: 50px;
  font-size: 32px;
  font-weight: bold;
  color: #333;
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
  height: 70vh;
  margin-bottom: 1px;
  border-radius: 4px;
  border: 1px solid #ccc;
  padding: 10px;
  font-size: 32px;
  box-sizing: border-box;
  display: flex; /* Use flexbox */
  flex-direction: row;
  justify-content: center; /* Center vertically */
  align-items: center; /* Center horizontally */
}

.submit-button { 
  width: 100%;
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

.user-enterable-area{
  border: none;
  background-color: inherit;
  font-size: 32px;
  color: white;
  height: 32px;
  width: 32px; /* todo This should be updated to be dynamic based on the length of the word */
  border-bottom: 1px solid white;
  margin-left: 5px;
  margin-right: 5px;
}

</style>