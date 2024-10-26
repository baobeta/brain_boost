import 'primeicons/primeicons.css';
import './index.css';
import 'floating-vue/dist/style.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import FloatingVue, { options } from 'floating-vue';
// import VueFeather from 'vue-feather';

import App from './App.vue';
import router from './router';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { setComponentPrefix } from './config/prime_prefix';
import ToastService from 'primevue/toastservice';

const app = createApp(App);

app.use(FloatingVue);
app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.fake-dark-mode-selector',
    },
  },
});
app.use(ToastService);

setComponentPrefix(app);

// app.component(VueFeather.name || 'vue-feather', VueFeather);

app.mount('#app');
