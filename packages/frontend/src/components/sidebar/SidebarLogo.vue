<script lang="ts" setup>
const imgLink = 'https://i.imgur.com/qHivSnr.jpeg'
</script>
<template>
  <section class="flex items-center justify-start p-2 mx-2 mt-2">
    <img :src="imgLink" class="w-8 h-8"/>
    <span class="ml-2 font-semibold">BrainBoost</span>
  </section>
</template>