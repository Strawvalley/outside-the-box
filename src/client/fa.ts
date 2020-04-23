import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMinusSquare } from '@fortawesome/free-regular-svg-icons/faMinusSquare'
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons/faPlusSquare'
import { faVolumeMute } from '@fortawesome/free-solid-svg-icons/faVolumeMute'
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons/faVolumeUp'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default function initializeFontAwesome(): void {
  library.add(faMinusSquare, faPlusSquare, faVolumeMute, faVolumeUp);
  Vue.component('font-awesome-icon', FontAwesomeIcon);
}
