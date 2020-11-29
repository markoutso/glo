import Vue from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faPlay,
  faSpinner,
  faMoon,
  faSun,
  faExpand,
  faCompress,
  faEllipsisH,
  faSearchMinus,
  faSearchPlus,
  faTimes,
  faFile,
  faWalking,
  faForward,
  faStop,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(
  faPlay,
  faSpinner,
  faMoon,
  faSun,
  faExpand,
  faCompress,
  faEllipsisH,
  faSearchMinus,
  faSearchPlus,
  faTimes,
  faFile,
  faWalking,
  faForward,
  faStop,
);

Vue.component('FontAwesomeIcon', FontAwesomeIcon);
