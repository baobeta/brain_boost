import './index.css'
import 'floating-vue/dist/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import FloatingVue from 'floating-vue'

import App from './App.vue'
import router from './router'



const app = createApp(App)

app.use(FloatingVue)
app.use(createPinia())
app.use(router)

app.mount('#app')
