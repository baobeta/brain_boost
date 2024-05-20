<template>
  <div>
    <VueMultiselect v-model="selected" :options="options"> </VueMultiselect>
  </div>
</template>

<script lang="ts" setup>
import VueMultiselect from "vue-multiselect";
import 'vue-multiselect/dist/vue-multiselect.css';
import { ref, defineModel } from "vue";

interface Option {
  label: string;
  value: string;
}

interface Props {
  options: (Option | string)[];
}

const selected = defineModel();

const props = withDefaults(defineProps<Props>(), {
  modelValue: "All",
  options: () => ["All", "one", "two"],
});
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
