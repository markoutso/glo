<template lang="pug">
  .symbol-scope(:class="darkmode ? 'darkmode': ''")
    div.scope-name
      span Όνομα εμβέλειας: 
      span.name {{ scope.name }}
    div
    .title Σταθερες:
    .grid
      .cv-display(v-for="constant in constants")
        .name {{ constant.name }}
        .type {{ constant.type }}
        .value {{ constant.value }}
    .title Μεταβλητες:
    .grid
      .cv-display(v-for="variable in variables")
        .name {{ variable.name }}
        .type {{ variable.type }}
        .value.table(v-if="Array.isArray(variable.value)" @click="selectArray(variable)") Προβολή
        .value(v-else-if="variable.value !== undefined") {{ variable.value }}
        .value.no-value(v-else)
    Popup(
      v-if="selectedArray"
      @close="closePopup"
      :title="`Προβολή πίνακα ${selectedArray.name}`"
      :darkmode="darkmode"
    )
      ArrayView(
        :array="selectedArray.value"
        :dimensionLength="selectedArray.dimensionLength"
        :darkmode="darkmode"
      )
</template>

<style lang="stylus" scoped>
.symbol-scope
  background white
  padding 20px 12px
  border-left 1px solid rgba(65,65,65,0.5)
  .scope-name
    margin-bottom 20px
    .name
      font-weight bold

  .grid
    display grid
    grid-template-columns 1fr 1fr
    grid-template-rows 1fr
    grid-gap 20px 25px
    margin 7px 0 30px 0

  .cv-display
    border 1px solid rgba(65,65,65,0.5)
    border-radius 10px
    text-align center
    font-size 15px
    display flex
    flex-direction column
    .name
      font-weight bold
    .value.no-value
      background #eee
      height 100%
    .value.table
      color #007bff
      cursor pointer
      text-decoration underline
    > *
      padding calc(20px / 2)
      &:not(:last-child)
        border-bottom 1px solid rgba(65,65,65,0.5)
      &:first-child
        border-top-left-radius @border-radius
        border-top-right-radius @border-radius
      &:last-child
        border-bottom-left-radius @border-radius
        border-bottom-right-radius @border-radius

  &.darkmode
    background black
    color #f8f8ff
    .value.no-value
      background #3d3d3d
</style>

<script lang="ts">
import { SymbolScope } from '@glossa-glo/symbol';
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator';
import { AST } from '@glossa-glo/ast';

import Popup from './Popup.vue';
import ArrayView from './ArrayView.vue';

interface Symbol {
  name: string;
  type: string;
  value: string|undefined;
  dimensionLength: number[]|undefined;
}

@Component({
  components: {
    Popup,
    ArrayView
  }
})
export default class SymbolScopeComponent extends Vue {
  @Prop() scope!: SymbolScope
  @Prop() node!: AST;
  @Prop() darkmode!: boolean;

  closePopup() {
    this.selectedArray = null;
  }

  selectedArray: Symbol|null = null;

  selectArray(arr: Symbol) {
    this.selectedArray = arr;
  }

  constants: Symbol[] = [];

  variables: Symbol[] = [];

  @Watch('node', {
    immediate: true,
  })
  changeVariables() {
    const variablesAndConstants = this.scope.getVariablesAndConstants();

    this.constants = variablesAndConstants.filter(vc => vc.isConstant);
    this.variables = variablesAndConstants.filter(vc => !vc.isConstant);
  }
}

</script>