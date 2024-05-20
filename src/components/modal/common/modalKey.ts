
import type { EventBusKey } from '@vueuse/core';
import type { Component } from 'vue';

export const modalKey: EventBusKey<{
  component: Component,
  props: any,
  closeOnClick: boolean,
  title: string,
}> = Symbol('this-is-modal-key');