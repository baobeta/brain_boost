import 'primeicons/primeicons.css';
import './index.css';
import 'floating-vue/dist/style.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import FloatingVue from 'floating-vue';

import App from './App.vue';
import router from './router';
import ToastService from 'primevue/toastservice';

const app = createApp(App);

app.use(FloatingVue);
app.use(createPinia());
app.use(router);
app.use(ToastService);

app.mount('#app');
