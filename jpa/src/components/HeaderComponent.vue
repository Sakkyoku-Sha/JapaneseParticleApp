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
        <div v-if="showInfoBox" class="info-box-overlay">
            <div v-if="showInfoBox" class="info-box">
                <div class="arrow-up"></div>
                <div class="section">
                    <h2>Website Developed by:</h2> 
                    <h3>Ryan Anderson</h3>
                </div>
                <hr>
                <div class="section">
                    <p><strong class="align-left">LinkedIn:</strong><a href="https://www.linkedin.com/in/ryan-anderson24/" target="_blank">linkedin.com/in/ryan-anderson24</a></p>
                    <p><strong class="align-left">Email:</strong><a href="mailto:RyanAnderson0147@gmail.com">RyanAnderson0147@gmail.com</a></p>
                    <p><strong class="align-left">Source Code:</strong><a href="https://github.com/Sakkyoku-Sha/JapaneseParticleApp" target="_blank">Available here</a></p>
                </div>
                <hr>
                <div class="section">
                    <p><strong class="align-left">Grammar Explanations:</strong>Powered by OpenAPI</p>
                    <p><strong class="align-left">Japanese Parsing:</strong>Enabled by <a href="https://github.com/atilika/kuromoji" target="_blank">Kuromoji</a></p>
                    <p><strong class="align-left">Japanese Input:</strong>Enabled by <a href="https://wanakana.com" target="_blank">WanaKana.js</a></p>
                    <p><strong class="align-left">UI Framework:</strong><a href="https://vuejs.org/" target="_blank">vuejs</a></p>
                </div>    
                <hr>                
            </div>
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
    align-items: center;
}
.header-right-group i {
    margin-right: 10px;
    color: #fff;
}
select {
    margin-right: 10px;
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
.info-box-overlay {
    position: absolute;
    top: 55px; /* Adjust as needed */
    right: 5px; /* Adjust as needed */
    width: 500px; /* Adjust as needed */
    z-index: 1000;
}
.info-box {
    position: relative;
    background-color: #646161;
    color: #fff;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
}
.arrow-up {
    position: absolute;
    top: -10px; /* Adjust as needed */
    right: 10px; /* Algn with the ? button */
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #646161;
    box-shadow: 0 -10px 10px -10px rgba(0, 0, 0, 0.9); /* Shadow on the upper edge */

}

h2 {
    font-size: 1.5em;
    margin-bottom: 10px;
}
p {
    margin: 10px 0;
}
a {
    color: #1a73e8;
    text-decoration: none;
}
a:hover {
    text-decoration: underline;
}
.align-left {
    display: inline-block;
    width: 220px; /* Adjust as needed */
    text-align: left;
}
.align-left + a {
    display: inline-block;
    text-align: right;
}
</style>