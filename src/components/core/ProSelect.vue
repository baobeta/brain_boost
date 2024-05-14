<template>
  <div>
    <VueMultiselect v-model="selected" :options="options"> </VueMultiselect>
  </div>
</template>

<script lang="ts" setup>
import VueMultiselect from "vue-multiselect";
import { ref, defineModel } from "vue";

interface Option {
  label: label;
  value: value;
}

interface Props {
  options: Option[];
}

const selected = defineModel();

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  options: () => ["one", "two"],
});
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
