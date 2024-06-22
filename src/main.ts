import './index.css'
import 'floating-vue/dist/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import FloatingVue from 'floating-vue'
import VueFeather from 'vue-feather';

import App from './App.vue'
import router from './router'



const app = createApp(App)

app.use(FloatingVue)
app.use(createPinia())
app.use(router);

app.component(VueFeather.name || 'vue-feather', VueFeather);

app.mount('#app')
