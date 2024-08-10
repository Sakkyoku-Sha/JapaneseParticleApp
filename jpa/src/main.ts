import { createApp } from 'vue'
import wanakanaDirective from '../src/directives/wanakanaDirective';
import App from './App.vue'

const app = createApp(App);

app.directive('wanakana', wanakanaDirective);

app.mount('#app')
