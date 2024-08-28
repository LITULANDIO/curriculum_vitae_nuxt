<template>
    <div class="h-screen flex px-2">
      <Terminal class="terminal-pane" />
      <FileNode 
          v-if="!isMobile"
          :nodes="tree" 
          :selectedFileId="selectedFileId"
          @selectNode="loadFileContent" />
      <CodeEditor 
        v-if="!isMobile"
        class="editor-container" 
        :currentCode="code"
        :currentFile="currentFile"
        @updateCode="updateCode" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick, computed } from 'vue';
  import { fileTree } from '../utils/common';
  import { terminal, particles, fileNode, codeEditor, splitContainer } from '../utils/templates';
  import Split from 'split.js';
  
  const splitInstance = ref(null);
  const currentFile = ref(null);
  const selectedFileId = ref(null);
  const tree = ref(fileTree)
  const code = ref('')
  const isMobile = computed(() => process.client && window.innerWidth <= 764)
  
  const updateSplit = () => {
    const terminalPane = document.querySelector('.terminal-pane');
    const editorContainer = document.querySelector('.editor-container');
    if (terminalPane && editorContainer) {
      if (splitInstance.value) {
        splitInstance.value.destroy();
      }
      splitInstance.value = Split([terminalPane, editorContainer], {
        sizes: [85, 15],
        minSize: [100, 100],
        gutterAlign: 'center',
        gutterSize: 10,
      });
    }
  };
  
  const resetSplit = () => {
    const terminalPane = document.querySelector('.terminal-pane');
    const editorContainer = document.querySelector('.editor-container');
    if (terminalPane && editorContainer) {
      if (splitInstance.value) {
        splitInstance.value.destroy();
      }
      splitInstance.value = Split([terminalPane, editorContainer], {
        sizes: [60, 40],
        minSize: [100, 100],
        gutterAlign: 'center',
        gutterSize: 10,
      });
    }
  };
  
  const loadFileContent = (file) => {
    selectedFileId.value = file.id;
    const fileContent = {
      'Terminal.vue': terminal,
      'Particles.vue': particles,
      'FileNode.vue': fileNode,
      'CodeEditor.vue': codeEditor,
      'SplitContainer.vue': splitContainer
    }[file.label] || '';
  
    code.value = fileContent;
    currentFile.value = file.label;
  
    nextTick(() => {
      resetSplit();
    });
  };
  
  const initializeDefaultFile = () => {
    if (selectedFileId.value === null) {
      const defaultFile = tree.value[0].children.find(child => 
        ['Terminal.vue', 'Particles.vue', 'FileNode.vue', 'CodeEditor.vue', 'SplitContainer.vue'].includes(child.label)
      );
      if (defaultFile) {
        selectedFileId.value = defaultFile.id
        loadFileContent(defaultFile);
      }
    }
  };
  
  const updateCode = (newCode) => {
    code.value = newCode;
  };
  
  onMounted(() => {
    initializeDefaultFile();
    nextTick(() => {
      updateSplit();
    });
    window.addEventListener('resize', () => {
      if (splitInstance.value) {
        updateSplit();
      }
    });
  });
  </script>
  
  <style lang="postcss">
  .editor-container {
    @apply w-full h-full bg-[#2d2d2d] text-white;
  }
  .gutter {
    @apply bg-[rgba(150,150,150,0.7)] bg-no-repeat bg-center relative z-[999];
  }
  .gutter-horizontal {
    @apply cursor-col-resize h-screen w-[20px] !important;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
  }
  .gutter-vertical {
    @apply cursor-row-resize h-[20px] w-full;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
  }
  </style>
  