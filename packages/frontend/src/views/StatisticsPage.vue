<script lang="ts" setup>
import ProSelect from "../components/core/ProSelect.vue";
import PillsTab from "../components/core/PillsTab.vue";
import BarChart from "../components/core/BarChart.vue";
import { useModalStore } from "@/components/modal/service/useModalStore";

const { openModal } = useModalStore();

function testModal () {
  openModal({
    component: BarChart,
    title: "test modal",
    props: {},
    closeOnClick: true
  });
}
</script>
<template>
  <section class="flex flex-col items-center mt-2">
    <div class="w-3/4">
      <button class="bg-red" @click="testModal">test modal</button>
      <section>
        <span class="text-slate-500 text-sm">Showing Statistics of</span>
        <ProSelect />
      </section>
      <PillsTab class="mt-4" />
      <BarChart />
    </div>
  </section>
</template>
