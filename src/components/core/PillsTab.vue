<script lang="ts" setup>
interface Props {
  options: string[];
}

const selected = defineModel();

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  options: () => ["one", "two", "tree"],
});
</script>
<template>
  <ul class="flex text-sm font-medium text-center text-gray-500 rounded border py-4">
    <li class="flex grow" v-for="option in options">
      <a
        href="#"
        class="px-4 py-2 rounded-lg border grow mx-2"
        @click="selected = option"
        :class="{ active: selected === option }"
        >{{ option }}</a
      >
    </li>
  </ul>
</template>
