import Vue from 'vue'
import VueRouter from 'vue-router'
// Load VueRouter instance containing front end routes
import router from './routes'
/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */
import axios from 'axios'
import NavMenu from './components/Menu'
// adonis websocket client
const ws = require('adonis-websocket-client')
const io = ws('')
const chan = io.channel('map-updates').connect()
// Attach Vue to window
window.Vue = Vue
// Use the VueRouter plugin
Vue.use(VueRouter)
// Make Axios available through window object
window.axios = axios
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
/**
 * Next we will register the CSRF Token as a common header with Axios so that
 * all outgoing HTTP requests automatically have it attached. This is just
 * a simple convenience so we don't have to attach every token manually.
 */
let token = document.querySelector('[name="_csrf"]')
if (token) {
  window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content
} else {
  console.error('CSRF token not found: https://adonisjs.com/docs/3.2/csrf-protection')
}
/* -------------------------------------------------------------- */
// The following two additions attach a global Event Bus and a Global Storage to Vue instance
// used to contain a single source of truth object and a communication mechanism between components.
// Create a global Event Bus
var EventBus = new Vue()
// Add to Vue properties by exposing a getter for $bus
Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function () {
      return EventBus
    }
  }
})
// Setup our global store object
let globalStore = {
  markers: new Map()
}
Vue.prototype.$store = globalStore
// Pass the websocket channel to Vue instance, use it with this.$socketChannel.on(handler method...)
Vue.prototype.$socketChannel = chan
// Instantiate the main Vue app and attach the global store
/* -------------------------------------------------------------- */
/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
const app = new Vue({
  el: '#app',
  router,
  // global-standalone components
  components: {
    NavMenu
  }
})
