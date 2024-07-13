<template>
  <div class="home-page">
    <header class="header">
      <div class="title">文法チェカー</div>
    </header>
    
    <main v-if="!submitted" class="main-content">
      <textarea v-model="currentText" class="text-area"></textarea>
      <button @click="submit" class="submit-button">Submit</button>
    </main>
    <div v-else class="hamburger-menu">

      <div class="text-area">
        <template v-for="token in globalTextContext.AnalyzedTokens">
          <span v-if="token.pos !== '助詞'" :key="token.id">
              {{ token.surface_form }}
          </span>
          <input v-else :key="'empty-' + token.id" class="user-enterable-area" type="text">
        </template>
      </div>
      
      
      <button @click="returnClick" class="submit-button">Return</button>
    </div>
  
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

  computed:{
    globalTextContext(){
      return GlobalTextContext;
    }
  },

  methods: {
    submit() {
      GlobalTextContext.onSubmittedTextChanged(this.currentText);
      console.log(GlobalTextContext.AnalyzedTokens);
      this.submitted = true;
    },
    returnClick(){
      this.submitted = false;
    },
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
}

.menu-item {
  margin-bottom: 10px;
}

/* .slide-enter-active, .slide-leave-active {
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
} */

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
  font-size: 32px;
  box-sizing: border-box;
  display: flex; /* Use flexbox */
  flex-direction: row;
  justify-content: center; /* Center vertically */
  align-items: center; /* Center horizontally */
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

.user-enterable-area{
  border: none;
  background-color: inherit;
  font-size: 32px;
  color: white;
  height: 32px;
  width: 32px; /* todo This should be updated to be dynamic based on the length of the word */
  border-bottom: 1px solid white;
  margin-left: 5px;
  margin-right: 5px;
}

</style>