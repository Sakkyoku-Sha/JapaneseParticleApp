<script setup lang="ts">

import {IpadicFeatures} from "kuromoji";
import { defineProps } from "vue";


type GuessingAreaProps = {
  underlyingToken : IpadicFeatures,
  tokenIndex : number,
  mode : "marked" | "inputting";
  onTextSubmit : (currentInput : string, index: number) => void;
  onClick : () => void;
};

const props = defineProps<GuessingAreaProps>();
</script>
<template>
    
    <div v-if="props.mode === 'inputting'" class="inputArea-inputting" >
        <input :key="'input-' + props.tokenIndex"/>
    </div>
    <div v-else class="inputArea-marked" style="background-color:">
        <button >{{ props.underlyingToken.surface_form }}</button>
    </div>


</template>

<style>

</style>