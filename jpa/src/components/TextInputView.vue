<script setup lang="ts">
import { withDefaults, defineProps } from "vue";
import { IpadicFeatures } from "kuromoji";
import {IsParticle} from "@/parsing/KuromojiHelperFunctions";

type TextInputViewProps = {
  analyzedTokens: IpadicFeatures[];
  marked: boolean;
  updateExplanation: (baseToken: IpadicFeatures, guessIndex: number) => void;
  setUserInput(index: number, value: string) : void;
  getUserInput(index: number) : string | undefined;
};

const props = withDefaults(defineProps<TextInputViewProps>(), {});

const onInputBlur = (event: FocusEvent, index: number) => {
  const target = event.target as HTMLInputElement;
  props.setUserInput(index, target.value);
};

const errorButtonClick = (token : IpadicFeatures, index: number) =>{
  props.updateExplanation(token, index);
}

const ShouldDisplayErrorButton = (index: number, token : IpadicFeatures) : boolean => {
  
  const userInput = props.getUserInput(index);
  
  return !props.marked &&
    userInput !== undefined && 
    userInput !== "" && 
    userInput !== token.surface_form; 
}
</script>

<template>
  <div class="TextInputView">
    <template v-for="(token, index) in props.analyzedTokens">
      <span v-if="!IsParticle(token)" 
        :key="'display-' + index"
        :class="'non-particle-text'">
          {{ token.surface_form }}
      </span>
      <input v-else-if="props.marked" 
        :key="'input-' + index"
        :value="props.getUserInput(index) || ''" 
        :class="'user-enterable-area '" 
        type="text"
        :maxlength="token.surface_form.length"
        :style="{ width: 32 * token.surface_form.length + 'px' }"
        @blur="onInputBlur($event, index)"/>
      <span v-else-if="!props.marked && props.getUserInput(index) === token.surface_form"
        :key="'correctInput-' + index"
        :class="'uneditable-area correct'"
        type="text">
        {{ token.surface_form }}
      </span>
      <button v-else-if="ShouldDisplayErrorButton(index, token)"
        :key="'incorrectInput-' + index"   
        :class="'errorButton incorrect'"
        @click="errorButtonClick(token, index)">
        {{ props.getUserInput(index) }}
      </button>
      <span v-else
        :key="'uneditable-' + index"
        :class="'uneditable-area'"
        type="text">
        {{ token.surface_form }}
      </span>
    </template>
  </div>
</template>

<style scoped>

.TextInputView {
  width: 100%;
  height: 100%;
  margin-bottom: 1px;
  border-radius: 4px;
  border: 1px solid #ccc;
  padding: 10px;
  font-size: 32px;
  box-sizing: border-box;
  display: flex; /* Use flexbox */
  flex-direction: row;
  justify-content: left; /* Center vertically */
  align-items: left; /* Center horizontally */
  flex-wrap: wrap;
  align-content: center;
}

.non-particle-text {
  text-wrap: nowrap;
}
.correct {
  background-color: #10d14d;
}

.incorrect {
  background-color: #d11010;
}

</style>