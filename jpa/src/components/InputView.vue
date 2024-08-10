<script setup lang="ts">
import { defineProps, withDefaults } from "vue";
import { InputView_Span } from "./InputViewSpanDefinition";

withDefaults(defineProps<{
  definitions : InputView_Span[],
}>(), {})

const OnInputBlur = (event: FocusEvent, onInput?: (value : string) => void ) => {
  const target = event.target as HTMLInputElement;
  onInput?.(target.value);
};

const OnButtonClick = (onClick?: () => void) => {
  onClick?.();
};

</script>

<template>
  <div class="TextInputView">
    <template v-for="(spanDefinition, wordIndex) in definitions">

      <span v-if="spanDefinition.type === 'Text'" 
        :key="'textSpan-' + wordIndex"
        :class="'plain-text'">
          {{ spanDefinition.text }}
      </span>

      <input v-else-if="spanDefinition.type === 'Input'" 
        type="text"
        :key="'inputSpan-' + wordIndex"
        :class="'inputSpan ' + spanDefinition.markedState"
        :value="spanDefinition.text" 
        :disabled="spanDefinition.markedState !== 'Unmarked'"
        :maxlength="spanDefinition.length"
        :style="{ width: 32 * spanDefinition.length + 'px' }"
        @blur="(event) => OnInputBlur(event, spanDefinition.OnInputChange)"/>

      <button v-else-if="spanDefinition.type === 'Button'"
        :key="'buttonSpan-' + wordIndex"   
        :class="'buttonSpan'"
        :style="{ width: Math.max(48, 32 * spanDefinition.text.length) + 'px' }"
        @click="() => {OnButtonClick(spanDefinition.OnClick)}">
          {{ spanDefinition.text }}
      </button>
      
    </template>
  </div>
</template>

<style scoped>

.TextInputView {
  width: 100%;
  height: 100%;
  margin-bottom: 1px;
  padding: 10px;
  font-size: 32px;
  box-sizing: border-box;
  display: flex; /* Use flexbox */
  flex-direction: row;
  justify-content: center; /* Center vertically */
  align-items: left; /* Center horizontally */
  flex-wrap: wrap;
  align-content: center;
  row-gap: 20px;
}

.plain-text {
  text-wrap: nowrap;
  text-align: bottom;
  line-height: 1.2;
}

.inputSpan{
  padding: 0;
  height: auto!important;
  border: none;
  background-color: inherit;
  font-size: 32px;
  color: white;
  border-bottom: 2px solid transparent; /* Fallback for older browsers */
  border-bottom: 2px solid white;
  border-image: repeating-linear-gradient(
    to right,
    white 0,
    white 28px,
    transparent 28px,
    transparent 32px
  ) 1;
}


.Correct {
  color: #10d14d;
  border-image: repeating-linear-gradient(
    to right,
    #10d14d 0,
    #10d14d 28px,
    transparent 28px,
    transparent 32px
  ) 1;
}

.Incorrect {
  
  color:#ff4d4d;
  border-image: repeating-linear-gradient(
    to right,
    #ff4d4d 0,
    #ff4d4d 28px,
    transparent 28px,
    transparent 32px
  ) 1;
}

.NotAnswered{
  color: #8a8c8e;
  opacity: 0.5;

  border-image: repeating-linear-gradient(
    to right,
    #ff4d4d 0,
    #ff4d4d 28px,
    transparent 28px,
    transparent 32px
  ) 1;
}

.buttonSpan {
  background-color: #ff4d4d; /* Red background */
  border: none;
  border-radius: 5px; /* Rounded corners */
  color: white; /* White text */
  margin-left: 5px;
  margin-right: 5px;
  font-size: 16px; /* Font size */
  cursor: pointer; /* Pointer cursor on hover */
  box-shadow: 0 4px #d32f2f; /* 3D shadow effect */
  transition: background-color 0.3s, transform 0.1s; /* Smooth transitions */
  text-align: center; /* Center text */
}

.buttonSpan:hover {
  background-color: #ff6666; /* Slightly lighter red on hover */
}

.buttonSpan:active {
  background-color: #ff1a1a; /* Darker red when clicked */
  transform: translateY(4px); /* Depress effect */
  box-shadow: 0 2px #d32f2f; /* Adjust shadow to match depress effect */
}

</style>