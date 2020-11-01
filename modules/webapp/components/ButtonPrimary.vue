<template lang="pug">
  button.btn(
    :class="`${color} ${disabled ? 'disabled' : ''}`"
    :disabled="disabled"
  )
    i.icon(:class="icon" :style="{...(!text && {fontSize: '1em'})}")
    .text(v-if="text") {{ text }}
</template>

<style lang="stylus" scoped>
.btn
  appearance none
  border 0
  border-radius 1.1875rem
  padding 12px 15px
  cursor pointer
  outline none
  display flex
  flex-direction row
  transition all .3s
  &.disabled
    pointer-events none
  .icon
    align-self center
    font-size .7em
  .text
    align-self center
    margin-left 9px
    font-weight 600
    letter-spacing .5px
  &:hover
  &:focus
    box-shadow 0px 5px 9px rgba(0, 0, 0, 0.16)

.blue
  color white
  background #007bff

.green
  color white
  background #28a745
</style>

<script lang="ts">
import 'reflect-metadata';
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class ButtonPrimary extends Vue {
  @Prop() icon!: string;
  @Prop() text!: string|undefined;
  @Prop() color!: string;
  @Prop({ default: false }) disabled!: boolean;
}
</script>
