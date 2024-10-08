<template>
    <div class="h-screen px-2 md:flex">
      <div class="flex flex-col terminal-pane">
        <transition  
          @before-enter="onBeforeEnter"
          @enter="onEnter"
          @leave="onLeave">
          <TimeLine 
            v-show="isTimeLineExperience && !selectedExperience"
            :events="experiences"
            @selectEvent="onSelectExeperience"
            />
        </transition>
        <transition  
          @before-enter="onBeforeEnter"
          @enter="onEnter"
          @leave="onLeave">
          <TimeLine 
            v-show="isTimeLineAcademy && !selectedAcademy"
            :events="academies"
            @selectEvent="onSelectAcademy"
            />
        </transition>
        <ContactForm :isVisible="isFormContact" @close="isFormContact = false"/>
        <transition name="detail">
          <CardDetail 
            v-if="selectedExperience"
            class="absolute w-full"
            :event="selectedExperience"
            @goBack="showTimeline"
          />
        </transition>
        <transition name="detail">
          <CardDetail 
            v-if="selectedAcademy"
            class="absolute w-full"
            :event="selectedAcademy"
            @goBack="showTimeline"
          />
        </transition>
        <Tooltip  v-if="isDelayShowComponents" 
          :text="$t('tooltip.text')" 
          :elementTop="elementTop" 
          :visible="isShowTooltip"
          :isBlinkToolTip="isBlinkToolTip"
          :blink="blinkToolTip"
          @onClicked="onHiddenToolTip"
        />
        <Terminal v-if="isDelayShowComponents" 
          ref="refTerminal"
          @showTimeLineExperience="onShowTimeLineExperience" 
          @showTimeLineAcademy="onShowTimeLineAcademy"
          @showFormContact="onShowFormContact"
          @showTooltip="onShowTooltip"/>
      </div>
      <template  v-if="!isMobile && isDelayShowComponents">
        <FileNode 
            :nodes="tree" 
            :selectedFileId="selectedFileId"
            @selectNode="loadFileContent" />
        <CodeEditor 
          class="editor-container" 
          :currentCode="code"
          :currentFile="currentFile"
          @updateCode="onUpdateCode" />
        </template>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick, computed, onUnmounted } from 'vue';
  import { fileTree, experience, academy } from '../utils/constants';
  import { terminal, particles, fileNode, codeEditor, splitContainer, timeLine, cardDetail, app, tooltip } from '../utils/templates';
  import { useI18n } from 'vue-i18n'
  import Split from 'split.js';
  import TimeLine from '../components/TimeLine.vue'
  import Tooltip  from '~/components/Tooltip.vue';
  
  const { t } = useI18n()
  const splitInstance = ref(null)
  const currentFile = ref(null)
  const selectedFileId = ref(null)
  const tree = ref(fileTree)
  const code = ref('')
  const isTimeLineExperience = ref(false)
  const isTimeLineAcademy = ref(false)
  const isFormContact = ref(false)
  const isMobile = computed(() => process.client && window.innerWidth < 515)
  const experiences = ref(experience)
  const academies = ref(academy)
  const selectedExperience = ref(null)
  const selectedAcademy = ref(null)
  const isDelayShowComponents = ref(false)
  const isShowTooltip = ref(false)
  const isBlinkToolTip = ref(false)
  const refTerminal = ref(null)
  const elementTop = ref(null)
  
  const updateSplit = () => {
    const terminalPane = document.querySelector('.terminal-pane');
    const editorContainer = document.querySelector('.editor-container');
    if (terminalPane && editorContainer) {
      if (splitInstance.value) {
        splitInstance.value.destroy();
      }
      splitInstance.value = Split([terminalPane, editorContainer], {
        sizes: [90, 10],
        minSize: [100, 100],
        gutterAlign: 'center',
        gutterSize: 10,
      });
    }
  };

  const onShowTimeLineExperience = value => isTimeLineExperience.value = value
  const onShowTimeLineAcademy = value => isTimeLineAcademy.value = value
  const onShowFormContact = value => isFormContact.value = value
  const onSelectExeperience = experience => selectedExperience.value = experience
  const onSelectAcademy = academy => selectedAcademy.value = academy
  const showTimeline = () => {
    selectedExperience.value = null
    selectedAcademy.value = null
  }
  const onShowTooltip = value => isShowTooltip.value = value
  const blinkToolTip = () => {
    isBlinkToolTip.value = !isBlinkToolTip.value;
    setTimeout(blinkToolTip, 500);
  }
  const onHiddenToolTip = () => {
    isShowTooltip.value = false
    isBlinkToolTip.value = false
  }
  const resetSplit = () => {
    const terminalPane = document.querySelector('.terminal-pane');
    const editorContainer = document.querySelector('.editor-container');
    if (terminalPane && editorContainer) {
      if (splitInstance.value) {
        splitInstance.value.destroy();
      }
      splitInstance.value = Split([terminalPane, editorContainer], {
        sizes: [70, 30],
        minSize: [100, 100],
        gutterAlign: 'center',
        gutterSize: 10,
      });
    }
  };
  
  const loadFileContent = file => {
    selectedFileId.value = file.id;
    const fileContent = {
      'Terminal.vue': terminal,
      'Particles.vue': particles,
      'FileNode.vue': fileNode,
      'CodeEditor.vue': codeEditor,
      'SplitContainer.vue': splitContainer,
      'TimeLine.vue': timeLine,
      'CardDetail.vue': cardDetail,
      'app.vue': app,
      'ToolTip.vue': tooltip
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
}
const onUpdateCode = newCode => code.value = newCode
const onBeforeEnter = el => {
  el.style.transform = 'rotateY(-90deg)'
  el.style.opacity = '0'
}
const onEnter = (el, done) => {
  setTimeout(() => {
    el.style.transition = 'transform 0.6s ease, opacity 0.6s ease'
    el.style.transform = 'rotateY(0deg)'
    el.style.opacity = '1'
    done()
  })
}
const onLeave = (el, done) => {
  el.style.transition = 'transform 0.6s ease, opacity 0.6s ease'
  el.style.transform = 'rotateY(90deg)'
  el.style.opacity = '0'
  setTimeout(() => {
    done()
  }, 600)
}  
onMounted(() => {
  nextTick(() => {
    isDelayShowComponents.value = true
    initializeDefaultFile()
    updateSplit()
  })
  window.addEventListener('resize', () => {
    if (splitInstance.value) {
      updateSplit()
    }
  })
})
onUpdated(() => {
  if (isDelayShowComponents.value) {
    elementTop.value = refTerminal.value.inputField
  }
})
onUnmounted(() => {
  window.removeEventListener('resize')
})
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
    transform: translateY(50px) scale(0.8);
  }

  .detail-enter-to, .detail-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
</style>
