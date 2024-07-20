<script setup lang="ts">

import {marked} from 'marked';
import {defineProps} from 'vue';

type MarkDownRendererProps = {
  markDownText: string;
};
const props = defineProps<MarkDownRendererProps>();
const parsedContent = marked(props.markDownText);

</script>

<template>
  <div v-html='parsedContent' class="MarkDownRenderer"/>
</template>

<style>
</style>