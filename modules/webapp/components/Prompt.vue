<template lang="pug">
  Popup.prompt(@close="close" :darkmode="darkmode" :title="title")
    textarea(
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      v-model="value"
    )
    ButtonPrimary.btn(:text="buttonText" color="blue" @click.native="submit")
</template>

<style lang="stylus" scoped>
textarea
  resize none
  height 200px
  width 300px
  font-size 16px
  border-radius 5px
.btn
  margin 15px auto 0 auto
</style>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Prop, Emit } from 'nuxt-property-decorator';

import { Portal } from '@linusborg/vue-simple-portal'
import vClickOutside from 'v-click-outside';

import Popup from './Popup.vue';
import ButtonPrimary from './ButtonPrimary.vue';

@Component({
  components: {
    Portal,
    ButtonPrimary,
    Popup,
  },
  directives: {
    clickOutside: vClickOutside.directive
  }
})
export default class Prompt extends Vue {
  @Prop() title!: string;
  @Prop() buttonText!: string;
  @Prop({ default: false }) darkmode!: boolean;
  @Prop({ default: '' }) startValue!: string;

  created() {
    this.value = this.startValue;
  }

  value = '';

  @Emit('close')
  close() {}

  submit() {
    this.$emit('submit', this.value);
    this.close();
  }
}
</script>