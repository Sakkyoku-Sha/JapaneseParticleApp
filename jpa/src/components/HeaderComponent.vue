<script setup lang="ts">

import { ref, defineProps, withDefaults } from 'vue';
import { ResponseLanguages } from '@/LLM/ResponseLanguages';

const props = withDefaults(defineProps<{
    selectedLanguage: {value : string, set : (language : string) => void};
}>(), {});


const showInfoBox = ref(false);

const onLanguageSelected = (event : Event) => {
  const value = (event.target as HTMLSelectElement).value;
  props.selectedLanguage.set(value);
}

const toggleInfoBox = () => {
    showInfoBox.value = !showInfoBox.value;
};

</script>

<template>
    <header class="app-header">
        <div class="header-content">
            <div class="title">助詞 Practice</div>
            <div class="header-right-group">
                <i class="fa-solid fa-language fa-2x"></i>
                <select @change="onLanguageSelected">
                    <option v-for="language in Object.values(ResponseLanguages)" :key="language" :value="language" :selected="selectedLanguage.value === language">
                    {{ language }}
                    </option>
                </select>
                <button class="info-button" @click="toggleInfoBox">?</button>
            </div>
          
        </div>
        <div v-if="showInfoBox" class="info-box">
            <p>Attributions for the app:</p>
            <!-- Add your attributions here -->
        </div>
    </header>
</template>

<style scoped>
.app-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #434343;
    color: #fff;
    padding: 10px;
}
.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}
.title {
    font-size: 24px;
    font-weight: bold;
}
.header-right-group {
    display: flex;
    column-gap: 15px;
}
.info-button {
    background-color: #fff;
    color: #333;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
}
.info-box {
    background-color: #444;
    color: #fff;
    padding: 10px;
    margin-top: 10px;
    border-radius: 5px;
}
</style>