<template>
    <div class="h-screen px-2" :class="!isMobile ? 'flex' : ''">
      <div class="flex flex-col terminal-pane">
        <transition  
          @before-enter="onBeforeEnter"
          @enter="onEnter"
          @leave="onLeave">
          <TimeLine 
            v-show="isTimeLine && !selectedExperience"
            :experience="events"
            @selectExperience="onSelectExeperience"
            />
        </transition>
        <ContactForm :isVisible="isFormContact" @close="isFormContact = false"/>
        <transition name="detail">
          <CardDetail 
            v-if="selectedExperience"
            class="absolute w-full"
            :experience="selectedExperience"
            @goBack="showTimeline"
          />
        </transition>
        <Terminal @showTimeLine="onShowTimeLine" @showFormContact="onShowFormContact"/>
      </div>
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
        @updateCode="onUpdateCode" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick, computed } from 'vue';
  import { fileTree, experience } from '../utils/constants';
  import { terminal, particles, fileNode, codeEditor, splitContainer, timeLine, cardDetail, app } from '../utils/templates';
  import Split from 'split.js';
  import TimeLine from '../components/TimeLine.vue'
  
  const splitInstance = ref(null);
  const currentFile = ref(null);
  const selectedFileId = ref(null);
  const tree = ref(fileTree)
  const code = ref('')
  const isTimeLine = ref(false)
  const isFormContact = ref(false)
  const isMobile = computed(() => process.client && window.innerWidth <= 764)
  const events = ref(experience)
  const selectedExperience = ref(null);

  
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

  const onShowTimeLine = (value) => {
    isTimeLine.value = value
  }
  const onShowFormContact = (value) => {
    console.log({value})
    isFormContact.value = value
  }
  const onSelectExeperience = (experience) => {
      selectedExperience.value = experience;
  };

  const showTimeline = () => {
  selectedExperience.value = null;
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
      'SplitContainer.vue': splitContainer,
      'TimeLine.vue': timeLine,
      'CardDetail.vue': cardDetail,
      'app.vue': app
    }[file.label] || '';
  
    code.value = fileContent;
    currentFile.value = file.label || app;
  
    nextTick(() => {
      resetSplit();
    });
  };
  
  const initializeDefaultFile = () => {
  if (selectedFileId.value === null) {
    const defaultFile = tree.value[0].children.find(child => child.label === 'app.vue');
    
    if (defaultFile) {
      selectedFileId.value = defaultFile.id;
      loadFileContent(defaultFile);
    }
  }
};
  
  const onUpdateCode = (newCode) => {
    code.value = newCode;
  };

  const onBeforeEnter = (el) => {
  el.style.transform = 'rotateY(-90deg)';
  el.style.opacity = '0';
};

const onEnter = (el, done) => {
  setTimeout(() => {
    el.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
    el.style.transform = 'rotateY(0deg)';
    el.style.opacity = '1';
    done();
  });
};

const onLeave = (el, done) => {
  el.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
  el.style.transform = 'rotateY(90deg)';
  el.style.opacity = '0';
  setTimeout(() => {
    done();
  }, 600);
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
  .detail-enter-active, .detail-leave-active {
    transition: all 0.8s ease;
  }
  
  .detail-enter-from, .detail-leave-to {
    opacity: 0;
    transform: translateY(50px) scale(0.8); /* Empieza desde abajo y con zoom reducido */
  }
  
  .detail-enter-to, .detail-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1); /* Termina en su posición normal con zoom normal */
  }
  </style>
  