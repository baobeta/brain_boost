<script lang="ts" setup>
import Panel from 'primevue/panel';
import SummaryCard from './SummaryCard.vue';

defineEmits(['learn']);
</script>
<template>
  <Panel>
    <div class="flex flex-col">
      <div class="flex justify-between space-x-2 p-10">
        <SummaryCard class="w-1/3" icon="sparkles" title="New" :total="0" :color="'purple'" />
        <SummaryCard class="w-1/3" icon="arrow-circle-right" title="Learning" :total="0" color="yellow" />
        <SummaryCard class="w-1/3" icon="book" title="Review" :total="0" color="blue" />
      </div>

      <PButton label="Learn" class="mt-2" @click="$emit('learn')" />
    </div>
  </Panel>
</template>
