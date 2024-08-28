<template>
    <div class="flex-1 flex flex-col">
      <MonacoEditor
        v-if="currentFile && localCode"
        class="flex-1 bg-[#2d2d2d] text-white"
        v-model="localCode"
        :lang="currentFileLang"
        :options="{ theme: monacoTheme }"
      />
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits, ref, watch } from 'vue';
  import { useTheme } from '~/composables/useTheme';

  const props = defineProps({
    currentCode: String,
    currentFile: String,
  });
  
  const emit = defineEmits(['updateCode']);
  const localCode = ref(props.currentCode);
  const { isDarkTheme } = useTheme();
  const monacoTheme = ref(isDarkTheme.value ? 'vs-dark' : 'vs');

  watch(() => props.currentCode, newCode => localCode.value = newCode)
  watch(isDarkTheme, newTheme =>  monacoTheme.value = newTheme ? 'vs-dark' : 'vs')
  watch(localCode, newCode => emit('updateCode', newCode))
  
  const currentFileLang = 'php';
  </script>
  
  <style lang="postcss">
  .editor-container {
    @apply w-full h-full bg-[#2d2d2d] text-white;
  }
  .gutter {
    @apply bg-[rgba(150,150,150,0.7)] bg-no-repeat bg-center relative z-[999];
  }
  .gutter-horizontal {
    @apply cursor-col-resize w-[20px];
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
  }
  .gutter-vertical {
    @apply cursor-row-resize h-[20px] w-full;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
  }
  </style>
  