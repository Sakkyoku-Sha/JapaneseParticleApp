<script setup lang="ts">
import SentenceCarousel from "@/components/SentenceCarousel.vue";
import {onMounted, defineProps, withDefaults, computed, ref } from 'vue';

import {SplitTokensBySentences} from "@/parsing/KuromojiHelperFunctions";
import {JapaneseParticleParser} from "@/parsing/JapaneseParticleParser";
import {IpadicFeatures} from "kuromoji";

import {GeneratePromptFromWrongAnswer} from "@/LLM/PromptGenerator";

//For now we will wait for the parser to initialize before we do anything else
//This could be done in a more elegant way, but for now this will work
onMounted(async () => {
  await JapaneseParticleParser.Initialize();
});


type QuestionAnsweringComponentProps = {
  userText: string;
};

const props = withDefaults(defineProps<QuestionAnsweringComponentProps>(), {});
const currentSentenceIndex = ref(0);

// Computed property for analyzed tokens
const analyzedTokens = computed(() => {
  return JapaneseParticleParser.parseJPText(props.userText);
});

// Computed property for split tokens
const splitTokens = computed(() => {
  return SplitTokensBySentences(analyzedTokens.value);
});

const updateSentence = (index: number) => {
      currentSentenceIndex.value = index;
};

const CurrentExplanation = ref("");

const GenerateExplanation = (guess : string, baseToken : IpadicFeatures, guessIndex : number) => {

  const correctAnswer = baseToken.surface_form;
  const allDisplayedStrings = splitTokens.value[currentSentenceIndex.value].map((token) => token.surface_form);
  const prompt = GeneratePromptFromWrongAnswer(guess, baseToken.surface_form, guessIndex, allDisplayedStrings, props.userText);
  
  //execute the prompt; 
  CHAT
}

</script>

<template>
    <div class="container">
        <div class="left-pane">
          <SentenceCarousel
            :tokenArrays="splitTokens"
            :currentSentenceIndex="currentSentenceIndex"
            @update-sentence="updateSentence"/>
        </div>
        <div class="right-pane">
          <MarkDownRenderer :markdownText="CurrentExplanation"/>
        </div>
    </div>
</template>

<style scoped>
.container {
  display: flex;
  height: 100vh; /* Full height of the viewport */
}

.left-pane {
  flex: 7; /* 70% width */
  border-right: 1px solid #ccc; /* Optional: Add a border for separation */
  padding: 10px; /* Optional: Add some padding */
}

.right-pane {
  flex: 3; /* 30% width */
  padding: 10px; /* Optional: Add some padding */
}
</style>