<template>
  <div class="home-page">
    <header class="header">
      <div class="title">文法チェカー</div>
    </header>
    <transition name="slide">
      <main v-if="!submitted" class="main-content">
        <textarea v-model="currentText" class="text-area"></textarea>
        <button @click="submit" class="submit-button">Submit</button>
      </main>
      <div v-else class="hamburger-menu">
        <!-- Add your menu items here -->
        <div class="menu-item">Menu Item 1</div>
        <div class="menu-item">Menu Item 2</div>
        <div class="menu-item">Menu Item 3</div>
        <button @click="returnClick" class="submit-button">Return</button>
      </div>
    </transition>
  </div>
</template>

<script>
import { GlobalTextContext } from "@/GlobalTextContext/GlobalTextContext.ts"
export default {
  name: 'HomePage',
  data(){
    return {
      currentText: '',
      submitted: false,
    };
  },

  methods: {
    submit() {
      this.submitted = true;
      GlobalTextContext.onSubmittedTextChanged(this.currentText);
      console.log(GlobalTextContext.AnalyzedTokens);
    },
    returnClick(){
      this.submitted = false;
    }
  },
};
</script>

<style scoped>
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
  box-sizing: border-box;
  transition: transform 1s ease;
}

.menu-item {
  margin-bottom: 10px;
}

.slide-enter-active, .slide-leave-active {
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
}

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
  font-size: 16px;
  box-sizing: border-box;
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
</style>