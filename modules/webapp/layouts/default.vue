<template lang="pug">
  #app
    nuxt.nuxt
</template>

<style lang="stylus">
#app
  position relative

.nuxt
  font-family 'Roboto', sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale

*
*:before
*:after
  box-sizing border-box
</style>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue } from 'nuxt-property-decorator';

@Component
export default class extends Vue {

}
</script>
