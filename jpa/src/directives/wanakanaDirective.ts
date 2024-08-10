import { Directive } from 'vue';
import { bind, unbind } from 'wanakana';

const wanakanaDirective: Directive<HTMLInputElement> = {
  mounted(el: HTMLInputElement) {
    bind(el);
  },
  unmounted(el: HTMLInputElement) {
    unbind(el);
  }
};

export default wanakanaDirective;