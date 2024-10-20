<script setup lang="ts">
import Desk from '@/models/desk';
import { useDesk } from '@/service/useDesk';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import SummaryCard from './SummaryCard.vue';
import CardElement from './CardElement.vue';
const route = useRoute();
const deskData = ref<Desk | null>(null);

const { getDesk } = useDesk();

// fetch the data when params change
watch(
  () => route.params.id,
  async (newId) => {
    if (!newId) return;
    if (typeof newId !== 'string') return;
    deskData.value = await getDesk(newId);
  },
  { immediate: true },
);
</script>
<template>
  <div v-if="deskData">
    <div>
      <div class="max-w-4xl mx-auto p-6 flex flex-col">
        <div class="flex justify-between">
          <div class="font-semibold text-xl">{{ deskData.name }}</div>
          <PButton label="Add Cards" outlined severity="contrast" icon="pi pi-plus" />
        </div>
        <div class="grid grid-cols-3 gap-4 mb-6 mt-2">
          <SummaryCard icon="sparkles" title="New" :total="0" :color="'purple'" />
          <SummaryCard icon="arrow-circle-right" title="Learning" :total="0" color="yellow" />
          <SummaryCard icon="book" title="Review" :total="0" color="blue" />
        </div>
        <PButton label="Learn" />
        <div class="flex justify-between items-center mt-6 mb-4">
          <div dir="ltr" data-orientation="horizontal">
            <div class="flex space-x-4">
              <div class="font-medium text-sm">Notebook</div>
              <div class="font-medium text-sm">Subdecks</div>
            </div>
          </div>
          <div class="flex space-x-2">
            <button
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Custom
            </button>
            <PButton icon="pi pi-ellipsis-v" outlined severity="contrast" />
          </div>
        </div>
        <div class="flex flex-col space-y-2">
          <CardElement id="test" front="Front" back="Back" :is-show-back="true" />
          <CardElement id="test" front="Front" back="Back" :is-show-back="false" />
        </div>
      </div>
    </div>
  </div>
  <div v-else>Not found this data</div>
</template>
