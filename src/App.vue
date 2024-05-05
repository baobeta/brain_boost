<script setup lang="ts">
import SideBar from './components/sidebar/SideBar.vue'
import HeaderView from './components/header/HeaderView.vue';
import FooterView from './components/footer/FooterView.vue';
import { RouterView } from 'vue-router'
</script>

<template>
  <main class="grow flex">
    <SideBar/>
    <section class="flex flex-col grow">
      <HeaderView/>
      <RouterView />
    </section>
  </main>
  <FooterView/>
</template>

<style scoped>
</style>
