<template>
  <div>{{ $route.params.deskId }}</div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const deskId = computed(() => route.params.deskId);
const reviewingCards = ref([]);
const reviewedCards = ref([]);

const today = new Date(Date.now());
</script>
