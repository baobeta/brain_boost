import type { App } from "vue";
import Button from "primevue/button"

export function setComponentPrefix (app: App) {
  app.component('PButton', Button);

}