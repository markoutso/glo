<template lang="pug">
  Portal(selector="body" v-click-outside)
    .prompt(:class="darkmode ? 'darkmode' : ''")
      .prompt-body(v-click-outside="close")
        FontAwesomeIcon.close(icon="times" @click="close")
        .title {{ title }}
        textarea(
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          v-model="value"
        )
        ButtonPrimary.btn(:text="buttonText" color="blue" @click.native="submit")
    div(class="portalBugFix")
</template>

<style lang="stylus">
.prompt
  position absolute
  top 0
  left 0
  height 100vh
  width 100vw
  background rgba(0,0,0,0.12)
  z-index 10
  display flex
  justify-content center
  align-items center
  cursor pointer
  flex-direction column
  .prompt-body
    background white
    padding 30px 50px
    border-radius 5px
    position relative
    cursor auto
    text-align center
    .title
      font-size 24px
      margin-bottom 20px
      pointer-events none
    textarea
      resize none
      height 200px
      width 300px
      font-family 'Roboto Mono' monospace;
      border-radius 5px
    .close
      position absolute
      right 10px
      top 7px
      cursor pointer
    .btn
      margin 15px auto 0 auto
  &.darkmode
    background rgba(255,255,255,0.12)
    .prompt-body
      background black
      .title
        color white
      textarea
        background black
        color white
</style>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Prop, Emit } from 'nuxt-property-decorator';

import { Portal } from '@linusborg/vue-simple-portal'
import vClickOutside from 'v-click-outside';

import ButtonPrimary from './ButtonPrimary.vue';

@Component({
  components: {
    Portal,
    ButtonPrimary,
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