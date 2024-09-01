import { Directive, DirectiveBinding, VNode } from 'vue';
import { bind, unbind } from 'wanakana';

const wanakanaDirective: Directive<HTMLInputElement> = {
  mounted(el: HTMLInputElement, binding, vnode) {
    bind(el);

    const handler = (event: Event) => inputHandler(event, el, binding, vnode);

    el.addEventListener('input', handler);

    // Store the handler so it can be removed later
    (el as any)._inputHandler = handler;

  },
  unmounted(el: HTMLInputElement) {
    unbind(el);
    if ((el as any)._inputHandler) {
      el.removeEventListener('input', (el as any)._inputHandler);
      delete (el as any)._inputHandler;
    }
  }
};

const processHandler = (el: HTMLInputElement, binding: DirectiveBinding<any>, vnode: VNode<any, HTMLInputElement, {[key: string]: any;}>) => {
  
  binding.instance?.$nextTick(() => {
    const processedValue = el.value;
    if (binding.value && typeof binding.value === 'function') {
      binding.value(processedValue);
    }
  });
};

const inputHandler = (event: Event, el: HTMLInputElement, binding: DirectiveBinding<any>, vnode: any) => {
  processHandler(el, binding, vnode);
};

export default wanakanaDirective;