<template lang="pug">
  .button-dropdown(v-click-outside="onClickOutside")
    ButtonSecondary.btn(
      icon="ellipsis-h"
      :color="color"
      :animate="false"
      :disabled="disabled"
      @click.native="toggleDropdown"
    )
    ol.menu(v-show="show" :class="color")
      li.menu-item(v-for="item in menu" @click="click(item[1])")
        span {{ item[0] }}
</template>

<style lang="stylus" scoped>
.button-dropdown
  position relative

.menu
  position absolute
  left 0
  top 48px
  padding 15px 0
  border-radius 1.1875rem
  .menu-item
    padding 15px
    cursor pointer
    text-align center
    white-space nowrap
    letter-spacing .5px
    font-size 13.7px
    &:first-child
      padding-top 0
    &:last-child
      padding-bottom 0
  &.black
    color black
    background white
    border 1px solid rgba(65,65,65, 0.5)
    .menu-item:not(:last-child)
      border-bottom 1px solid rgba(65,65,65, 0.5)
  &.white
    color #f8f8ff
    background black
    border 1px solid rgba(190,190,190, 0.5)
    .menu-item:not(:last-child)
      border-bottom 1px solid rgba(190,190,190, 0.5)


</style>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator';
import ButtonSecondary from './ButtonSecondary.vue';

import vClickOutside from 'v-click-outside';

@Component({
  components: {
    ButtonSecondary,
  },
  directives: {
    clickOutside: vClickOutside.directive
  }
})
export default class ButtonDropdown extends Vue {
  @Prop() color!: string;
  @Prop() menu!: [string, string][];
  @Prop({ default: false }) disabled!: boolean;

  show = false

  toggleDropdown() {
    this.show = !this.show;
  }

  click(name: string) {
    this.show = false;
    this.$emit(`click${name}`);
  }

  onClickOutside() {
    this.show = false;
  }
}
</script>