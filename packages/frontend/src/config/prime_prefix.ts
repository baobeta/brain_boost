import type { App } from 'vue';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import Icon from '@/components/core/Icon.vue';

export function setComponentPrefix(app: App) {
  app.component('PButton', Button);
  app.component('PMenu', Menu);
  app.component('Icon', Icon);
}
