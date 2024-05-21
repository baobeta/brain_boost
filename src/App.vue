<script setup lang="ts">

import SideBar from './components/sidebar/SideBar.vue';
import HeaderView from './components/header/HeaderView.vue';
import FooterView from './components/footer/FooterView.vue';
import RootModal from './components/modal/RootModal.vue';
import { RouterView } from 'vue-router'
import { useProvideModalStore } from './components/modal/service/useModalStore';

useProvideModalStore();
</script>

<template>
  <RootModal/>
  <main class="grow flex">
    <SideBar/>
      <section class="flex flex-col grow">
      <HeaderView/>
      <RouterView />
    </section>
  </main>
  <FooterView/>
</template>

<style scoped></style>
