import fullscreen from 'vue-fullscreen';
import Vue from 'vue';

Vue.use(fullscreen);

declare module 'vue/types/vue' {
  interface Vue {
    $fullscreen: {
      toggle: (
        el: Element,
        options?: {
          wrap?: boolean;
          callback?: (fullscreen: boolean) => void;
        },
      ) => void;
    };
  }
}
