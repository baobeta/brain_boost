<template>
  <Editor
    v-model="value"
    class="preview-data"
    :editor-options="editorOptions"
    readonly
    editor-style="border: none;"
    @load="onLoad"
    @update:model-value="onChange"
  >
    <template #toolbar> </template>
  </Editor>
</template>
<script setup lang="ts">
import Editor, { type EditorLoadEvent } from 'primevue/editor';
import { onMounted, nextTick, ref } from 'vue';
const editorOptions = {
  modules: {
    toolbar: false,
  },
};
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
</script>
<style>
.preview-data {
  .p-editor-toolbar {
    display: none;
  }
}
</style>
