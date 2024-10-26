<template>
  <div ref="editor" class="flex flex-col">
    <div class="flex font-semibold">{{ label }}</div>
    <Editor v-model="value" editor-style="height: 320px" @load="onLoad" @update:model-value="onChange" />
  </div>
</template>
<script setup lang="ts">
import Editor, { type EditorLoadEvent } from 'primevue/editor';
import { onMounted, nextTick, ref } from 'vue';
defineProps<{ label: string }>();
const value = defineModel<string>();
const editor = ref();

onMounted(() => {
  if (editor?.value) {
    const delta = editor.value?.quill?.clipboard?.convert({
      html: value.value || '',
    });
    nextTick(() => editor.value?.quill?.setContents(delta));
  }
});

const onLoad = ({ instance }: EditorLoadEvent) => {
  instance.setContents(
    instance.clipboard.convert({
      html: value.value,
    }),
  );
};
// Fix needed for Quill v2: https://github.com/primefaces/primevue/issues/5606#issuecomment-2203975395
(Editor as any).methods.renderValue = function renderValue(this: { quill?: Quill }, value: string) {
  if (this.quill) {
    if (value) {
      const delta = this.quill.clipboard.convert({ html: value });
      this.quill.setContents(delta, 'silent');
    } else {
      this.quill.setText('');
    }
  }
};
const onChange = (v: string) => {
  value.value = v;
};
</script>
