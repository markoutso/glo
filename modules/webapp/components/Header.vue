<template lang="pug">
  .header(:class="darkmode ? 'darkmode': ''")
    img.logo(:src="!darkmode ? img('logo-day.png') : img('logo-night.png')")
    .buttons
      ButtonPrimary(
        @click.native="interpret"
        :text="!interpreting ? 'Εκτέλεση' : 'Εκτελείται...'"
        :icon="!interpreting ? 'fas fa-play' : 'fas fa-spinner'"
        :color="!interpreting ? 'green' : 'blue'"
        :disabled="actionBeingPerformed"
      )
      ButtonSecondary.mode-switch(
        @click.native="toggleDarkmode"
        :icon="!darkmode ? 'fas fa-moon' : 'fas fa-sun'"
        :text="!darkmode ? 'Λειτουργία Νύκτας' : 'Λειτουργία Μέρας'"
        :color="!darkmode ? 'black' : 'white'"
      )
      ButtonSecondary.mode-switch-small(
        @click.native="toggleDarkmode"
        :icon="!darkmode ? 'fas fa-moon' : 'fas fa-sun'"
        :color="!darkmode ? 'black' : 'white'"
      )
      ButtonSecondary(
        @click.native="toggleAnimate"
        :icon="!animating ? 'fas fa-running' : 'fas fa-stop'"
        :color="!darkmode ? 'black' : 'white'"
        :disabled="interpreting"
      )
      ButtonSecondary(
        @click.native="download"
        icon="fas fa-save"
        color="black"
      )
      ButtonSecondary(
        @click.native="toggleFullscreen"
        :icon="!fullscreen ? 'fas fa-expand' : 'fas fa-compress'"
        :color="!darkmode ? 'black' : 'white'"
      )
    .zoom
      i.fas.fa-search-plus(@click="increaseFontSize" :class="darkmode ? 'darkmode' : ''")
      i.fas.fa-search-minus(@click="reduceFontSize" :class="darkmode ? 'darkmode' : ''")
</template>

<style lang="stylus" scoped>
.header
  box-shadow 0px 0px 5px 0px rgba(65,65,65,0.5)
  display flex
  align-items center
  flex-direction row
  justify-content space-between
  padding 0 30px
  background white
  position relative
  z-index 5
  .logo
    height 35px
  .buttons
    display flex
    flex-direction row
    > *
      margin-right 15px
    &:last-child
      margin-right 0
  .zoom
    font-size 1.1em
    i
      cursor pointer
      &:first-child
        margin-right 12px
      &.darkmode
        color #f8f8ff
  &.darkmode
    background black

.mode-switch-small
  display none
@media (max-width 900px)
  .mode-switch
    display none
  .mode-switch-small
    display block
</style>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Prop, Emit } from 'nuxt-property-decorator';

import ButtonPrimary from '../components/ButtonPrimary.vue';
import ButtonSecondary from '../components/ButtonSecondary.vue';

@Component({
  components: {
    ButtonPrimary,
    ButtonSecondary,
  },
})
export default class Header extends Vue {
  @Prop() interpreting!: boolean;
  @Prop() animating!: boolean;
  @Prop() fullscreen!: boolean;
  @Prop() darkmode!: boolean;
  @Prop() actionBeingPerformed!: boolean;

  @Emit('toggleDarkmode')
  toggleDarkmode() {}

  @Emit('interpret')
  interpret() {}

  @Emit('toggleFullscreen')
  toggleFullscreen() {}

  @Emit('animate')
  animate() {}

  @Emit('stopAnimate')
  stopAnimate() {}

  @Emit('download')
  download() {}

  toggleAnimate() {
    if(!this.animating) return this.animate();
    else return this.stopAnimate();
  }

  @Emit('reduceFontSize')
  reduceFontSize() {}

  @Emit('increaseFontSize')
  increaseFontSize() {}

  img(filename: string) {
    return require(`../assets/img/${filename}`)
  }
}
</script>
