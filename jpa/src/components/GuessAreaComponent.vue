<script setup lang="ts">
import { defineProps } from "vue";

type GuessAreaComponentProps = {
    generatePrompt : () => string;
    marked : boolean
}

const props = defineProps<GuessAreaComponentProps>();

</script>

<template>
    <div v-if="!props.marked">
        
    </div>
    <div v-else>
    </div>

</template>

<style>
</style>