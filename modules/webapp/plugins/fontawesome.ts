import Vue from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faPlay,
  faSpinner,
  faMoon,
  faSun,
  faRunning,
  faStop,
  faSave,
  faExpand,
  faCompress,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(
  faPlay,
  faSpinner,
  faMoon,
  faSun,
  faRunning,
  faStop,
  faSave,
  faExpand,
  faCompress,
);

Vue.component('FontAwesomeIcon', FontAwesomeIcon);
