<script setup lang="ts">
import SideBar from './components/sidebar/SideBar.vue';
import HeaderView from './components/header/HeaderView.vue';
import FooterView from './components/footer/FooterView.vue';
import RootModal from './components/modal/RootModal.vue';
import { RouterView } from 'vue-router';
import { useProvideModalStore } from './components/modal/service/useModalStore';
import Toast from 'primevue/toast';

useProvideModalStore();
console.log('App');
</script>

<template>
  <div class="size-full flex flex-col">
    <Toast />
    <RootModal />
    <main class="grow flex">
      <SideBar />
      <section class="flex flex-col grow">
        <HeaderView />
        <RouterView />
      </section>
    </main>
    <FooterView />
  </div>
</template>

<style scoped></style>
