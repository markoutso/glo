<template lang="pug">
  .header(:class="darkmode ? 'darkmode': ''")
    img.logo.logo-regular(:src="!darkmode ? img('logo-day.png') : img('logo-night.png')")
    img.logo.logo-small(:src="!darkmode ? img('logo-day-small.png') : img('logo-night-small.png')")
    .buttons
      ButtonPrimary.interpret(
        @click.native="interpret"
        :text="!interpreting ? 'Εκτέλεση' : 'Εκτελείται...'"
        :icon="!interpreting ? 'play' : 'spinner'"
        :color="!interpreting ? 'green' : 'blue'"
        :disabled="actionBeingPerformed"
      )
      ButtonPrimary.interpret-small(
        @click.native="interpret"
        :icon="!interpreting ? 'play' : 'spinner'"
        :color="!interpreting ? 'green' : 'blue'"
        :disabled="actionBeingPerformed"
      )
      ButtonSecondary.mode-switch(
        @click.native="toggleDarkmode"
        :icon="!darkmode ? 'moon' : 'sun'"
        :text="!darkmode ? 'Λειτουργία Νύκτας' : 'Λειτουργία Μέρας'"
        :color="!darkmode ? 'black' : 'white'"
      )
      ButtonSecondary.mode-switch-small(
        @click.native="toggleDarkmode"
        :icon="!darkmode ? 'moon' : 'sun'"
        :color="!darkmode ? 'black' : 'white'"
      )
      //- ButtonSecondary.animate(
      //-   @click.native="toggleAnimate"
      //-   :icon="!animating ? 'running' : 'stop'"
      //-   :color="!darkmode ? 'black' : 'white'"
      //-   :disabled="interpreting"
      //- )
      ButtonSecondary.download(
        @click.native="download"
        icon="save"
        color="black"
        :color="!darkmode ? 'black' : 'white'"
      )
      ButtonDropdown.more-options(
        :color="!darkmode ? 'black' : 'white'"
        :menu="[ [!animating ? 'Animate' : 'Στοπ Animate', 'Animate'], ['Copyright', 'Copyright'], ['Επικοινωνία', 'Contact'] ]"
        @clickAnimate="toggleAnimate"
        @clickCopyright="openCopyright"
        @clickContact="openContact"
      )
      ButtonSecondary.fullscreen(
        @click.native="toggleFullscreen"
        :icon="!fullscreen ? 'expand' : 'compress'"
        :color="!darkmode ? 'black' : 'white'"
      )
    .zoom
      i.fas.search-plus(@click="increaseFontSize" :class="darkmode ? 'darkmode' : ''")
      i.fas.search-minus(@click="reduceFontSize" :class="darkmode ? 'darkmode' : ''")
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
    align-items center
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

.logo-small
  display none
@media (max-width 750px)
  .logo-regular
    display none
  .logo-small
    display block

.interpret-small
  display none
@media (max-width 600px)
  .interpret
  .mode-switch
  .mode-switch-small
  .download
  .more-options
  .fullscreen
  .zoom
    display none
  .interpret-small
    display block
  .header
    padding 0 12px
    .buttons
      > *
        margin-right 0
</style>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue, Prop, Emit } from 'nuxt-property-decorator';

import ButtonPrimary from '../components/ButtonPrimary.vue';
import ButtonSecondary from '../components/ButtonSecondary.vue';
import ButtonDropdown from '../components/ButtonDropdown.vue';

@Component({
  components: {
    ButtonPrimary,
    ButtonSecondary,
    ButtonDropdown,
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

  openCopyright() {
    window.location.href = '/copyright.html';
  }

  openContact() {
    window.location.href = '/contact.html';
  }

  img(filename: string) {
    return require(`../assets/img/${filename}`)
  }
}
</script>
