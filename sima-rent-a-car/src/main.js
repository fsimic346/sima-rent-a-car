import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { VueCookieNext } from 'vue-cookie-next'
import axios from 'axios'
import VueAxios from 'vue-axios'

const app = createApp(App)
app.use(router)
app.use(VueCookieNext)
app.use(VueAxios, axios)
app.mount('#app')

app.config.globalProperties.axios = axios
