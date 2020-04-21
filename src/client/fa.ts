import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLessThan, faGreaterThan } from '@fortawesome/free-solid-svg-icons'
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default function initializeFontAwesome(): void {
  library.add(faLessThan, faGreaterThan, faMinusSquare, faPlusSquare)
  Vue.component('font-awesome-icon', FontAwesomeIcon)
}
