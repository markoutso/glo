import Vue from 'vue';

export default Vue.observable<{
  inputFile: string;
}>({
  inputFile: '',
});
