export const terminal = `
<template>
  <div ref="terminalPane" class="inset-0 flex items-center justify-center">
    <div ref="terminalContainer" class="mx-auto w-full max-w-[600px]  px-[10px] h-auto absolute z-10 terminal-container" @pointerdown="focusHiddenInput">
      <div
        :class="['relative w-full rounded-[10px] flex flex-col overflow-hidden font-mono text-left bg-transparent h-[350px] md:h-[420px]', themeClass, shadowClass]">
        <div
          :class="['w-full h-[30px] rounded-t-[10px] flex items-center justify-between px-[10px] box-border z-10 terminal-body', themeClass]">
          <div class="flex gap-2">
            <span class="w-[12px] h-[12px] rounded-full bg-[#ff5f57]"></span>
            <span
              class="w-[12px] h-[12px] rounded-full bg-[#ffbd2e] cursor-pointer">
            </span>
            <span
              class="w-[12px] h-[12px] rounded-full bg-[#28c940] cursor-pointer">
            </span>
          </div>
          <div :class="['flex-1 text-center font-bold', themeClass]">{{ $t('terminal.header') }}</div>
        </div>
        <div
          :class="['absolute top-[25px] left-0 right-0 bottom-0 rounded-b-[10px] z-0', themeClass]"
          >
        </div>
        <div ref="outputRef" class="relative z-20 flex-1 overflow-y-auto p-2.5 whitespace-pre-wrap pb-2.5 text-xs md:text-base max-h-[350px]">
          <div v-for="(line, index) in translatedOutputLines" :key="index">
            <span>{{ line }}</span>
          </div>
        </div>
        <div ref="inputField" class="relative z-20 flex items-center p-2.5 text-xs md:text-base field">
          <span class="text-[#00ff00] mr-1.5">$ </span>
          <input
            ref="hiddenInput"
            v-model="currentInput"
            class="absolute top-0 left-0 w-[1px] h-[1px] opacity-0 pointer-events-none"
            @click="focusHiddenInput"
            @keyup.enter="processUserCommand"
            @touch="focusHiddenInput"
          />
          <span class="flex-1 outline-none overflow-hidden text-[#00ff00] whitespace-nowrap">
            {{ currentInput }}
          </span>
          <span
            :class="['inline-block w-[10px] bg-[#00ff00] text-[#00ff00] ml-1.5', cursorClass]"
            >|</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted, nextTick, onBeforeUnmount, defineEmits, defineExpose, provide } from 'vue';
  import { useTheme } from '~/composables/useTheme';
  import { useI18n } from 'vue-i18n'

  const outputLines = ref([])
  const currentInput = ref('')
  const cursorActive = ref(true)
  const hiddenInput = ref(null)
  const outputRef = ref(null)
  const commandIndex = ref(0)
  const charIndex = ref(0)
  const isUserInputEnabled = ref(false)
  const editorInstance = ref(null)
  const { isDarkTheme } = useTheme()
  const { t, locale } = useI18n()
  const terminalContainer = ref(null)
  const inputField = ref(null)

  const emit = defineEmits(['showTimeLineExperience', 'showTimeLineAcademy', 'showFormContact', 'showTooltip'])
  const commands = computed(() => [
    t('terminal.commands1'),
    t('terminal.commands2'),
    t('terminal.commands3'),
    t('terminal.commands4')
  ])
  const themeClass = computed(() => isDarkTheme ? 'bg-black' : 'bg-white')
  const shadowClass = computed(() => isDarkTheme ? 'shadow-shadow-white' : 'shadow-shadow-dark')
  const cursorClass = computed(() => cursorActive ? 'opacity-100' : 'opacity-0')

  const typeCommand = () => {
    if (commandIndex.value < commands.value.length) {
      if (charIndex.value < commands.value[commandIndex.value].length) {
        currentInput.value += commands.value[commandIndex.value].charAt(charIndex.value)
        charIndex.value++
        setTimeout(typeCommand, 100)
      } else {
        const fullCommand = commands.value[commandIndex.value]
        outputLines.value.push(fullCommand)
        
        setTimeout(() => {
          currentInput.value = ''
          setTimeout(() => {
            commandIndex.value++
            typeCommand()
          }, 500)
        }, 1500)
        
        charIndex.value = 0
      }
    } else {
      outputLines.value.push(' ')
      outputLines.value.push('terminal.commands5')
      outputLines.value.push('terminal.commands6')
      isUserInputEnabled.value = true;
      emit('showTooltip', true)
    }
    scrollToBottom()
  }

  const translatedOutputLines = computed(() => {
    return outputLines.value.map(line => {
      if (line == '¡Hola!👋 me llamo Carles' || line == 'Hello!👋 My name is Carles') {
        return t('terminal.commands1')
      } else if (line == 'Bienvenido a mi currículum interactivo' || line == 'Welcome to my interactive resume') {
        return t('terminal.commands2') 
      } else if (line == 'Soy un apasionado del diseño y desarrollo web 👨🏻‍💻' || line  == 'I am passionate about web design and development 👨🏻‍💻') {
        return t('terminal.commands3')
      } else if (line == 'Mi especialidad es el Front end' || line == 'My specialty is Frontend') {
        return t('terminal.commands4')
      } else if (line == 'Comando no reconocido' || line == 'Command not recognised') {
        return t('terminal.commands7')
      } else {
        return t(line)
      }
    })
  })
  const sendEmiterShowTimeLineExperience = () => emit('showTimeLineExperience', true)
  const sendEmiterHiddenTimeLineExperience = () => emit('showTimeLineExperience', false)
  const sendEmiterShowContactForm = () => emit('showFormContact', true)
  const sendEmiterHiddenContactForm = () => emit('showFormContact', false)
  const sendEmiterShowTimelineAcademy = () => emit('showTimeLineAcademy', true)
  const sendEmiterHiddenTimelineAcademy = () => emit('showTimeLineAcademy', false)
  const showTooltip = () => emit('showTooltip', false)

  const downloadPDF = () => {
    const link = document.createElement('a')
    link.href = '/api/pdf';
    link.download = 'cv_carlesfar.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  const processUserCommand = (input) => {
    if (typeof input !== 'string') return

    const commands = {
      'ayuda': handleHelp,
      'help': handleHelp,
      'experiencia': () => handleExperience('terminal.commands10'),
      'experience': () => handleExperience('terminal.commands10'),
      'formacion': () => handleAcademy('terminal.commands11'),
      'academy': () => handleAcademy('terminal.commands11'),
      'proyectos': handleProjects,
      'projects': handleProjects,
      'contacto': handleContact,
      'contact': handleContact,
      'descargar_cv': () => handleDownloadCV('terminal.commands9'),
      'download_cv': () => handleDownloadCV('terminal.commands9'),
      'limpiar': handleClear,
      'clear': handleClear
    };

    const command = commands[input.toLowerCase()]
    if (command) {
      command()
    } else {
      outputLines.value.push(t('terminal.commands7', { input }))
    }
    
    scrollToBottom()
  };

  const handleHelp = () => {
    outputLines.value.push('terminal.help1', 'terminal.help2', 'terminal.help7', 'terminal.help3', 'terminal.help4', 'terminal.help5', 'terminal.help6');
    hideAllSections()
  }

  const handleExperience = message => {
    emit('showTimeLineExperience', true)
    hideAllSections(['showTimeLineExperience'])
    outputLines.value.push(message)
    hiddenInput.value.blur()
  };

  const handleAcademy = message => {
    emit('showTimeLineAcademy', true)
    hideAllSections(['showTimeLineAcademy'])
    outputLines.value.push(message)
    hiddenInput.value.blur()
  };

  const handleProjects = () => {
    window.open('https://github.com/LITULANDIO', '_blank')
    outputLines.value.push('terminal.commands8')
    hideAllSections()
  };

  const handleContact = () => {
    window.location.href = 'mailto:contacto@carlesfar.com'
    hideAllSections()
    hiddenInput.value.blur()
  };

  const handleDownloadCV = message => {
    downloadPDF()
    outputLines.value.push(message)
    hideAllSections()
  };

  const handleClear = () => {
    hideAllSections()
    outputLines.value = []
  };

  const hideAllSections = (exceptSections = []) => {
    const sections = ['showTimeLineExperience', 'showFormContact', 'showTimeLineAcademy'];
    sections.forEach(section => {
      if (!exceptSections.includes(section)) {
        emit(section, false)
      }
    })
  }

  const handleKeyPress = (event) => {
    if (!isUserInputEnabled.value) return
    event.preventDefault()

    if (event.key === 'Enter') {
      if (currentInput.value.trim() !== '') {
        outputLines.value.push(currentInput.value)
        processUserCommand(currentInput.value)
        currentInput.value = ''
      }
    } else if (event.key === 'Backspace') {
      currentInput.value = currentInput.value.slice(0, -1)
    } else if (event.key.length === 1) {
      currentInput.value += event.key
    }
    scrollToBottom()
  };
  
  const blinkCursor = () => {
    cursorActive.value = !cursorActive.value
    setTimeout(blinkCursor, 500)
  }
  
  const scrollToBottom = () => {
    nextTick(() => {
      const outputEl = outputRef.value
      if (outputEl) {
        outputEl.scrollTop = outputEl.scrollHeight
      }
    })
  }
  
  const focusHiddenInput = () => {
    if (hiddenInput.value) {
      hiddenInput.value.focus()
      showTooltip()
    }
  }
  
  // const minimizeTerminal = () => {
  //   const terminal = document.querySelector('.terminal')
  //   terminal.classList.add('terminal-minimized')
  // }
  
  // const maximizeTerminal = () => {
  //   const terminal = document.querySelector('.terminal')
  //   terminal.classList.remove('terminal-minimized')
  // }

  const handleTouchStart = (event) => {
  nextTick(() => {
    const terminalPane = document.querySelector('.terminal-pane')
    if (terminalPane && terminalPane.contains(event.target)) {
      focusHiddenInput()
      window.scrollTo(0, 50)
    }
  })
  }

const handleResize = () => {
  setTimeout(() => {
    scrollToBottom()
  }, 300)
}
defineExpose({ inputField })

  onMounted(() => {
    console.log(locale.value)
    typeCommand()
    blinkCursor()
    terminalContainer.value.addEventListener('touchstart', handleTouchStart)
    terminalContainer.value.addEventListener('keydown', handleKeyPress)
    window.addEventListener('resize', handleResize)
  })

  onBeforeUnmount(() => {
    if (editorInstance.value) {
      editorInstance.value.dispose()
    }
    window.removeEventListener('touchstart', handleTouchStart)
    window.removeEventListener('keydown', handleKeyPress)
    window.removeEventListener('resize', handleResize)
  })
  </script>
  
  <style lang="postcss">

  .terminal-container {
    top: 20rem;
    @media (max-width: 795px) {
      top: 5rem;
    }
  }
   .terminal-minimized {
    @apply fixed bottom-0 right-0 w-1/3 h-20 transition-all duration-300 z-20;
  }

  .terminal-minimized {
    @apply w-full h-20;
  }

  .gutter {
    @apply bg-[rgba(150,150,150,0.7)] bg-no-repeat bg-center relative z-[999];
  }
  
  .gutter-horizontal {
    @apply cursor-col-resize h-screen w-[20px];
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
  }
  
  .gutter-vertical {
    @apply cursor-row-resize h-[20px] w-full;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
  }
  </style>
  `;

export const particles = `
<template>
  <div id="tsparticles" class="fixed inset-0 w-screen h-screen z-[-10]"
  :class="[isDarkTheme ? 'bg-black' : 'bg-white']"
  ></div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { tsParticles } from 'tsparticles-engine';
import { loadImageShape } from 'tsparticles-shape-image';
import { loadSlim } from 'tsparticles-slim';
import { useTheme } from '~/composables/useTheme';

const { isDarkTheme } = useTheme()
const isMobile = computed(() => process.client && window.innerWidth <= 764)

const particlesOptions = {
  fullScreen: {
    enable: true,
    zIndex: -1,
  },
  particles: {
    number: {
      value: isMobile ? 10 : 50
    },
    shape: {
      type: 'image',
      image: [
        { src: '/assets/js.png', width: 30, height: 30 },
        { src: '/assets/html5.png', width: 30, height: 30 },
        { src: '/assets/css.jpg', width: 30, height: 30 },
        { src: '/assets/vue.png', width: 30, height: 30 },
        { src: '/assets/json.png', width: 30, height: 30 },
        { src: '/assets/storybook.png', width: 30, height: 30 },
        { src: '/assets/tailwindcss.png', width: 30, height: 30 },
        { src: '/assets/figma.png', width: 30, height: 30 },
        { src: '/assets/visual_studio_code.png', width: 30, height: 30 },
        { src: '/assets/nuxt.png', width: 30, height: 30 },
        { src: '/assets/nodejs.png', width: 30, height: 30 },
        { src: '/assets/git.png', width: 30, height: 30 },
      ],
    },
    move: {
      enable: true,
      speed: 2,
      collisions: {
        enable: true,
      },
    },
    opacity: {
      value: 0.7,
    },
    size: {
      value: 20,
    },
  },
  detectRetina: true,
};

const particlesInit = async () => {
  await loadSlim(tsParticles);
  await loadImageShape(tsParticles);
  tsParticles.load('tsparticles', particlesOptions);
};

onMounted(() => {
  particlesInit().catch(console.error);
});
</script>
`

export const fileNode = `
<template>
  <div class="file-tree w-64 overflow-auto md:h-full md:overflow-y-auto"
    :class="[isDarkTheme ? 'shadow-shadow-white bg-[#2d2d2d] text-white' : 'shadow-shadow-dark bg-white text-black']"
  >
    <ul class="list-none pl-5">
      <li v-for="node in nodes" :key="node.id">
        <div
          class="file-tree_content flex items-center py-1.5 font-mono cursor-pointer hover:text-green-400 text-sm"
          :class="{ 'font-bold text-green-400': isSelected(node) }"
          @click="selectNode(node)"
        >
          <img v-if="node.children" width="20" :src="isDarkTheme ? iconFolderDark(node) : iconFolderWhite(node)" class="mr-2" />
          {{ node.label }}
        </div>
        <ul v-if="node.open && node.children" class="pl-5">
          <li v-for="child in node.children" :key="child.id">
            <div
              class="file-tree_content flex items-center py-1.5 font-mono cursor-pointer hover:text-green-400 text-sm"
              :class="{ 'font-bold text-green-400': isSelected(child) }"
              @click.stop="selectNode(child)"
            >
              <img v-if="child.children" width="20" :src="isDarkTheme ? iconFolderDark(child) : iconFolderWhite(child)" class="mr-2" />
              {{ child.label }}
            </div>
            <ul v-if="child.open && child.children" class="pl-5">
              <li v-for="grandchild in child.children" :key="grandchild.id">
                <div
                  class="file-tree_content flex items-center py-1.5 font-mono cursor-pointer hover:text-green-400 text-sm"
                  :class="{ 'font-bold text-green-400': isSelected(grandchild) }"
                  @click.stop="selectNode(grandchild)"
                >
                  {{ grandchild.label }}
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  import { useTheme } from '~/composables/useTheme';
  const { isDarkTheme } = useTheme();

  const props = defineProps({
    nodes: Array,
    selectedFileId: Number
  });
  
  const emit = defineEmits(['selectNode']);
  
  const selectNode = (node) => {
    if (node.children) {
      node.open = !node.open;
    }
    emit('selectNode', node);
  };

  const iconFolderWhite = node => node.open ? '/assets/folder-open-dark.svg' : '/assets/folder-dark.svg'
  const iconFolderDark = node => node.open ? '/assets/folder-open.svg' : '/assets/folder.svg'
  const isSelected = node => node.id === props.selectedFileId;
  </script>
  
  <style lang="postcss">
  .shadow-custom {
    @apply shadow-none;
    box-shadow: -5px 0px 10px rgba(255, 255, 255, 0.5);
  }
</style>
`

export const codeEditor = `
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
`

export const splitContainer = `
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
  import { ref, onMounted, nextTick, compute, onUnmounted } from 'vue';
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


`

export const timeLine = `
<template>
    <div class="timeline-wrap z-0">
      <button
        class="timeline-nav-button timeline-nav-button--prev transition-transform transform hover:scale-105 active:scale-95"
        @click="prev"
        :disabled="currentIndex === 0"
      >
      <img src="/assets/arrow-left.svg" alt="Prev" class="w-5 h-5" />
      </button>
  
      <div class="timeline">
        <div class="timeline-items" :style="{ transform: translateX($currentTranslatepx), height: '300px' }">
          <div 
            v-for="(event, index) in events" 
            :key="index" 
            class="timeline-item"
            :class="{ 'timeline-item--bottom': index % 2 !== 0 }"
          >
            <div 
            class="timeline-content font-mono text-xs md:text-base" 
            :class="[isDarkTheme ? 'bg-black text-white dark-theme' : 'bg-white text-black']"
            @click="onSelectExperience(event)">
              <h2 class="font-bold">{{ event.year }}</h2>
              <div class="flex items-center">
                  <img :src="event.img" class="w-10 h-10"/>
                  <p class="ml-2">{{ event.text }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="timeline-divider"></div>
        <div class="timeline-points">
          <div 
            v-for="(event, index) in experience" 
            :key="'point-' + index" 
            class="timeline-point"
            :style="{ left: $index * itemWidth + itemWidth / 2}px}"
          ></div>
        </div>
      </div>
  
      <button
        class="timeline-nav-button timeline-nav-button--next transition-transform transform hover:scale-105 active:scale-95"
        @click="next"
        :disabled="currentIndex >= experience.length - visibleItems"
      >
      <img src="/assets/arrow-right.svg" alt="Prev" class="w-5 h-5" />
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, defineProps, defineEmits } from 'vue';
  import { useTheme } from '~/composables/useTheme';

  const props = defineProps({
    events: {
        type: Array,
        default: [{ year: '', text: '' }]
    }
  })
  const emit = defineEmits(['selectEvent'])
  const currentIndex = ref(0);
  const itemWidth = 300;
  const visibleItems = process.client && window.innerWidth < 515 ? 1 : 2;
  const currentTranslate = computed(() => -currentIndex.value * itemWidth);
  const { isDarkTheme } = useTheme();

  const onSelectExperience = (event) => emit('selectEvent', event)
  
  const prev = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--;
    }
  }
  
  const next = () => {
    if (currentIndex.value < props.events.length - visibleItems) {
      currentIndex.value++;
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .timeline-wrap {
    display: flex;
    justify-content: center;
    align-items: center ;
    padding: 20px;
    width: 60%;
    position: absolute;
    left: 10%;
    transform: translate(-20%, -20%);
    z-index: 2;
    @media (max-width: 795px) {
      width: 100%;
      top: 26rem;
      left: 0%;
      padding: 10px;
    }
  }
  
  .timeline {
    position: relative;
    width: 80%;
    overflow: hidden;
  }
  
  .timeline-items {
    display: flex;
    transition: transform 0.8s ease;
  }
  
  .timeline-item {
    width: 300px; 
    position: relative;
    flex-shrink: 0;
    top: 115px;
  }
  
  .timeline-item--bottom .timeline-content {
    margin-left: 30px;
    position: relative;
    top: 60px;
  }
  
  .timeline-item--bottom .timeline-content::before {
    content: '';
    position: absolute;
    left: 115px;
    width: 0;
    height: 0;
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent #ddd  transparent;
    transform: rotate(180deg);
    top: -20px !important;
  }
  .timeline-item--bottom .dark-theme.timeline-content::before {
    content: '';
    position: absolute;
    left: 115px;
    width: 0;
    height: 0;
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent white transparent;
    transform: rotate(180deg);
    top: -20px !important;
  }
  
  .timeline-item .timeline-content {
    margin-left: 30px;
    position: relative;
    bottom: 74px;
    @media (max-width: 795px) {
      width: 240px;
    }
  }
  
  .timeline-item .timeline-content::before {
    content: '';
    position: absolute;
    left: 115px;
    width: 0;
    height: 0;
    border-width: 10px;
    border-style: solid;
    border-color: #ddd transparent transparent transparent;
    top: 84px;
    @media (max-width: 795px) {
      top: 77px;
    }
  }

  .timeline-item .dark-theme.timeline-content::before {
    content: '';
    position: absolute;
    left: 115px;
    width: 0;
    height: 0;
    border-width: 10px;
    border-style: solid;
    border-color: white transparent transparent transparent;
    top: 84px;
    @media (max-width: 795px) {
      top: 77px;
    }
  }
  
  .timeline-content {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
  }
  
  .timeline-divider {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 4px;
    background-color: #ddd;
    transform: translateY(-50%);
    z-index: 1;
    margin-left: 3px;
    margin-right: 3px;
  }
  
  .timeline-nav-button {
    background-color: #fff;
    border: 2px solid #ddd;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
  }
  
  .timeline-nav-button:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  
  .timeline-points {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    transform: translateY(-50%);
  }
  
  .timeline-point {
    width: 12px;
    height: 12px;
    background: #ddd;
    border-radius: 50%;
    position: absolute;
    top: -6px;
  }
  </style>
`

export const cardDetail = `
<template>
  <div 
    class="detail-container relative p-5 md:w-[70%] mx-auto rounded-[15px] border border-solid top-[-10rem] md:top-[20rem] w-full font-mono text-xs md:text-base z-20"  
    :class="[isDarkTheme ? 'bg-black text-white border-[#ddd]' : 'bg-white text-black border-[#ddd]']"
  >
    <h2 class="font-bold mb-1">{{ event.text }}</h2>
    <p>{{ translateDescription }}</p>
    <button 
      class="back-arrow mt-5 p-2 rounded cursor-pointer font-mono text-xs md:text-base transition-transform transform hover:scale-105 active:scale-95"
      @click="$emit('goBack')"
      :class="[isDarkTheme ? 'bg-white text-black' : 'bg-black text-white']"
    >
      {{ $t('card-detail.back') }}
    </button>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { useTheme } from '~/composables/useTheme'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})
const { isDarkTheme } = useTheme()
const translateDescription = computed(() => t(props.event.description))

</script>
`

export const app = `
<template>
  <div>
    <ChangeTheme />
    <ChangeLanguage />
    <Particles />
    <SplitContainer />
  </div>
</template>

<style>
body {
  margin: 0;
}
</style>

`

export const tooltip = `
<template>
    <transition
      enter-active-class="transition-opacity duration-500"
      leave-active-class="transition-opacity duration-500"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
    <div v-if="visible" class="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 group-hover:block z-50" 
    :class="[isBlinkToolTip ? 'opacity-100' : 'opacity-0']"
    :style="{ top: styleTop, left: styleLeft }" >
    <div class="relative bg-gray-700 text-white text-sm rounded py-2 px-3">
     {{ text }}
      <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-t-8 border-t-gray-700 border-x-8 border-x-transparent"></div>
    </div>
  </div>
    </transition>
</template>

<script setup>
import { defineProps, onMounted, nextTick } from 'vue'
const styleTop = ref('0')
const styleLeft = ref('0')

const props = defineProps({
    text: String,
    visible: Boolean,
    elementTop: Object,
    isBlinkToolTip: Boolean,
    blink: Function
})

onMounted(() => {
    props.blink()
    nextTick(() => {
        if (props.elementTop) {
            styleTop.value = {String(props.elementTop.getBoundingClientRect().top.toFixed(0) -10)}px
            styleLeft.value = {String(props.elementTop.getBoundingClientRect().right.toFixed(0) -10)}px
        }
    })
})


</script>
`