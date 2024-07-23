<script setup lang="ts">
import { computed, ref, defineProps } from "vue";
import { IpadicFeatures } from "kuromoji";

type TextInputViewProps = {
  analyzedTokens: IpadicFeatures[];
};
const props = defineProps<TextInputViewProps>();

const guessingMode =ref(false);
const tokenDisplayRange = ref({ min: 0, max: props.analyzedTokens.length });
const userInputs = ref(new Map<number, string>());

const displayTokens = computed(() => {
  return props.analyzedTokens.slice(tokenDisplayRange.value.min, tokenDisplayRange.value.max);
});


const onInputBlur = (event: FocusEvent, index: number) => {
  const target = event.target as HTMLInputElement;
  userInputs.value.set(index, target.value);
};

const OnMarkButtonClick = () => {
  guessingMode.value = !guessingMode.value;
}

const determineClassName = (index: number) => {
  const token = displayTokens.value[index];
  const userEnteredValue = userInputs.value.get(index);
  if (userEnteredValue === undefined) {
    return '';
  }
  return token.surface_form === userEnteredValue ? 'correct' : 'incorrect';
}; 

</script>

<template>
  <div class="TextInputView">
    <template v-for="(token, index) in displayTokens">
          <span v-if="token.pos !== '助詞'" :key="'display-' + index">
            {{ token.surface_form }}
          </span>
          <input v-else :key="'input-' + index"
          :value="userInputs.get(index) || ''" 
          :class="'user-enterable-area ' + determineClassName(index)" 
          type="text"
          @blur="onInputBlur($event, index)"/>
    </template>
  </div>
  <button class="mark-button" @click="OnMarkButtonClick">
      Mark
  </button>
</template>

<style scoped>

.TextInputView {
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

.mark-button { 
  width: 100%;
  background-color: #10d14d;
  color: white;
  border: none; 
  padding: 15px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.mark-button:hover {
  background-color: #037d40;
}

.correct {
  background-color: #10d14d;
}

.incorrect {
  background-color: #d11010;
}

</style>