// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css'
import BootstrapVue3 from 'bootstrap-vue-3'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

createApp(App)
  .use(Toast, {
    position: POSITION.TOP_RIGHT,
    timeout: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    icon: true,
    rtl: false,
  })
  .use(BootstrapVue3)

  .use(router)

  .mount('#app')
