<template lang="pug">
  .page(ref="page" @change="fullscreenChange")
    Header(
      :interpreting="interpreting"
      :animating="animating"
      :fullscreen="fullscreen"
      :darkmode="darkmode"
      :actionBeingPerformed="actionBeingPerformed"
      @interpret="interpret"
      @toggleFullscreen="toggleFullscreen"
      @toggleDarkmode="toggleDarkmode"
      @animate="animate"
      @reduceFontSize="reduceFontSize"
      @increaseFontSize="increaseFontSize"
      @stopAnimate="stopAnimate"
      @download="download"
    )
    codemirror.editor(
      ref="editor"
      v-model="appropriateSourceCode"
      :options="options"
      :class="darkmode ? 'darkmode' : ''"
      :style="{fontSize}"
      @focus="clearError"
    )
    ol.console(
      ref="console"
      :class="darkmode ? 'darkmode' : ''"
      :style="{fontSize}"
    )
      .placeholder(
        v-show="(!console || !console.length) && !readFunction"
      ) Κονσόλα εισόδου/εξόδου
      li(v-for="item in console" v-html="item")
      input.read(
        rf="readInput"
        v-model="read"
        v-show="readFunction"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        @keyup.enter="submitRead"
      )
</template>

<style lang="stylus" scoped>
header-height = 70px
console-height = 200px
console-height-mobile = 150px
console-margin = 5px

read-color = #fcba03
read-color-dark = #634903

>>> .header
  height header-height

.page
  background white

.editor
  height "calc(100vh - %s - %s)" % (header-height console-height)
  font-family "Roboto Mono", monospace
  outline none
  line-height 1.25
  @media (max-width 600px)
    height "calc(100vh - %s - %s)" % (header-height console-height-mobile)
  >>> .CodeMirror
    height "calc(100vh - %s - %s)" % (header-height console-height)
    @media (max-width 600px)
      height "calc(100vh - %s - %s)" % (header-height console-height-mobile)
    padding-top 5px
  >>> .read
    background read-color
  >>> .error
    background rgba(255, 0, 0, 0.35)
  >>> *
    line-height 1.25
    font-family "Roboto Mono", monospace
  &.darkmode
    >>> .read
      background read-color-dark

.console
  height console-height
  width 100%
  outline none
  margin 0
  padding 10px 15px
  border 0
  font-family "Roboto Mono", monospace
  // box-shadow 0px 0px 5px 0px rgba(65,65,65,0.5)
  border-top 1px solid rgba(65,65,65,0.5)
  line-height 1.25
  position relative
  z-index 5
  background white
  overflow-y scroll
  @media (max-width 600px)
    padding 10px 12px
    height console-height-mobile
  >>> .error
    color #dc3545
    font-weight bold
  .placeholder
    color rgba(65,65,65,0.5)
    font-weight bold
    pointer-events none
    user-select none
  .read
    appearance none
    border 0
    width 100%
    font-size 17px
    outline 0
    background read-color
  &.darkmode
    background black
    color #f8f8ff
    .placeholder
      color rgba(190,190,190,0.6)
    .read
      background read-color-dark
</style>

<script lang="ts">
import 'reflect-metadata';
import { Component, Vue } from 'nuxt-property-decorator';
import gloInterpret from '@glossa-glo/glo';
import GLOError, { DebugInfoProviderLike } from '@glossa-glo/error';

import { CodeMirror, codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/darcula.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/addon/selection/active-line.js'
import 'codemirror/addon/selection/mark-selection.js'

import '../glossa.js'

import Header from '../components/Header.vue';

@Component({
  components: {
    Header,
    codemirror
  },
  mixins: [require('vue-save-state').default]
})
export default class InterpreterPage extends Vue {
  $refs!: {
    page: Element,
    console: Element,
    editor: any,
  };

  error: any = null;

  clearError() {
    if(this.error) {
      this.error.clear();
      this.error = null;
    }
  }

  highlightError(debugInfoProvider: DebugInfoProviderLike) {
    this.clearError();
    const cm = this.$refs.editor.codemirror;

    this.error = cm.markText({
      line: debugInfoProvider.start.linePosition,
      ch: debugInfoProvider.start.characterPosition
    },{
      line: debugInfoProvider.end.linePosition,
      ch: debugInfoProvider.end.characterPosition
    }, {className: 'error'});
  }

  highlightLine(line: number, className: string) {
    const cm = this.$refs.editor.codemirror;

    cm.addLineClass(line, 'background', className);
  }

  unhighlightLine(line: number, className: string) {
    const cm = this.$refs.editor.codemirror;

    cm.removeLineClass(line, 'background', className);
  }

  sourceCode: string = '';
  console: string[] = [];
  read = '';
  interpreting = false;
  animating = false;
  readFunction: ((values: string[]) => void) | null = null;

  get actionBeingPerformed() {
    return this.interpreting || this.animating;
  }

  get appropriateSourceCode() {
    return !this.animating ? this.sourceCode : this.sourceCodeCopy;
  }

  set appropriateSourceCode(value: string) {
    if(!this.animating) this.sourceCode = value;
    else this.sourceCodeCopy = value;
  }

  get options() {
    return {
      tabSize: 4,
      lineNumbers: this.onLoadWidth > 600 ? true : false,
      line: true,
      readOnly: this.actionBeingPerformed,
      theme: !this.darkmode ? 'eclipse' : 'darcula',
      mode: 'text/x-glossa',
      styleActiveLine: this.onLoadWidth > 600 ? true : false,
      styleSelectedText: true
    }
  }

  download() {
    const blob = new Blob([this.sourceCode], {
      type: 'text/plain'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'program.glo';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  }

  consoleNewLine(message: string, error = false) {
    this.console.push(
      !error
        ? `<div>${message}</div>`
        : `<div class="error">Σφάλμα: ${message}</div>`,
    );

    setTimeout(() => {
      if(this.$refs.console) {
        if(this.readFunction)
          this.$refs.console.lastElementChild!.scrollIntoView(true);
        else
          this.$refs.console.lastElementChild!.previousElementSibling!.scrollIntoView(true);
      }
    });
  }

  consoleReset() {
    this.console = [];
  }

  async submitRead() {
    if (this.readFunction) {
      this.consoleNewLine(this.read);
      this.readFunction(this.read ? this.read.split(' ') : []);
      this.read = '';
      this.readFunction = null;
    }
  }

  async interpret() {
    if (this.actionBeingPerformed) return;

    this.clearError();

    this.consoleReset();
    this.interpreting = true;

    try {
      await gloInterpret(
        this.sourceCode[this.sourceCode.length - 1] === '\n'
          ? this.sourceCode
          : this.sourceCode + '\n',
        {
          read: lineNumber => {
            this.highlightLine(lineNumber, 'read');
            return new Promise(resolve => {
              this.readFunction = (...args: any[]) => {
                this.unhighlightLine(lineNumber, 'read');
                return resolve(...args);
              };
            });
          },
          write: (...data) => {
            this.consoleNewLine(data.join(' '));
            return Promise.resolve();
          },
        },
      );
    } catch (_error) {
      if (_error instanceof GLOError) {
        let error = _error as GLOError;

        this.consoleNewLine(error.message, true);
        if (
          // error.start.linePosition === error.end.linePosition &&
          error.start.linePosition !== -1 &&
          error.start.characterPosition !== -1 &&
          error.end.characterPosition !== -1
        )
          this.highlightError(error);
      }
    }
    this.interpreting = false;
  }

  fullscreen: boolean = false;
  fullscreenChange(fullscreen: boolean) {
    this.fullscreen = fullscreen;
  }
  toggleFullscreen() {
    this.$fullscreen.toggle(this.$refs.page, {
      wrap: false,
      callback: this.fullscreenChange,
    });
  }

  darkmode = false;
  toggleDarkmode() {
    this.darkmode = !this.darkmode;
  }

  sourceCodeCopy = '';
  animateInterval: any = null;
  animate() {
    if(this.actionBeingPerformed) return;

    this.clearError();
    this.consoleReset();

    if(this.sourceCode.split('\n').length < 3) {
      this.consoleNewLine('Γράψε τουλάχιστον 3 γραμμές κώδικα για την λειτουργία Animation', true);
    }

    this.animating = true;
    let i = 0;
    this.animateInterval = setInterval(() => {
      while(/\s/.test(this.sourceCode[i])) {
        this.sourceCodeCopy += this.sourceCode[i++];
      }

      if(this.sourceCodeCopy.length >= this.sourceCode.length) {
        clearInterval(this.animateInterval);
        this.animating = false;
        this.sourceCodeCopy = '';
        return
      }

      this.sourceCodeCopy += this.sourceCode[i++];
    }, 100)
  }

  stopAnimate() {
    clearInterval(this.animateInterval);
    this.animating = false;
    this.sourceCodeCopy = '';
  }

  fontSize = '17px';
  increaseFontSize() {
    this.fontSize = parseInt(this.fontSize.slice(0, -2)) + 1 + 'px';
  }
  reduceFontSize() {
    this.fontSize = parseInt(this.fontSize.slice(0, -2)) - 1 + 'px';
  }

  onLoadWidth: number = 0;
  created() {
    this.onLoadWidth = innerWidth;
    if(this.onLoadWidth <= 600) {
      this.fontSize = '16px';
    }
  }

  getSaveStateConfig() {
    return {
      cacheKey: 'glo',
      saveProperties: ['sourceCode', 'darkmode', 'fontSize']
    };
  }
}
</script>
