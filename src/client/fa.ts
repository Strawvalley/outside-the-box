import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLessThan, faGreaterThan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default function initializeFontAwesome(): void {
  library.add(faLessThan, faGreaterThan)
  Vue.component('font-awesome-icon', FontAwesomeIcon)
}
