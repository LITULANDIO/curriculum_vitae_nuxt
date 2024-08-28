export const terminal = `
<template>
  <div ref="terminalPane" class="inset-0 flex items-center justify-center overflow-auto terminal-pane">
    <div class="mx-auto relative z-10 w-full max-w-[600px] h-auto">
      <div
        class="relative w-full rounded-[10px] flex flex-col overflow-hidden font-mono text-left bg-transparent h-[350px] md:h-[420px]"
        :class="[isDarkTheme ? 'text-white' : 'text-black', isDarkTheme ? 'shadow-shadow-white' : 'shadow-shadow-dark']">
        <div
          class="w-full h-[30px] rounded-t-[10px] flex items-center justify-between px-[10px] box-border z-10 terminal-body"
          :class="[isDarkTheme ? 'bg-white' : 'bg-black']">
          <div class="flex gap-2">
            <span class="w-[12px] h-[12px] rounded-full bg-[#ff5f57]"></span>
            <span
              @click="minimizeTerminal"
              class="w-[12px] h-[12px] rounded-full bg-[#ffbd2e] cursor-pointer">
            </span>
            <span
              @click="maximizeTerminal"
              class="w-[12px] h-[12px] rounded-full bg-[#28c940] cursor-pointer">
            </span>
          </div>
          <div class="flex-1 text-center font-bold"
          :class="[isDarkTheme ? 'text-black' : 'text-white']">Terminal de Comandos</div>
        </div>
        <div
          class="absolute top-[25px] left-0 right-0 bottom-0 rounded-b-[10px] z-0"
          :class="[isDarkTheme ? 'bg-black' : 'bg-white']"
          >
        </div>
        <div ref="outputRef" class="relative z-20 flex-1 overflow-y-auto p-2.5 whitespace-pre-wrap pb-2.5 text-xs md:text-base max-h-[350px]"> <!-- Control de tamaño de fuente y altura máxima -->
          <div v-for="(line, index) in outputLines" :key="index">
            <span>{{ line }}</span>
          </div>
        </div>
        <div class="relative z-20 flex items-center p-2.5 text-xs md:text-base">
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
            class="inline-block w-[10px] bg-[#00ff00] text-[#00ff00] ml-1.5"
            :class="[cursorActive ? 'opacity-100' : 'opacity-0']"
            >|</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
  import { useTheme } from '~/composables/useTheme';
  const outputLines = ref([]);
  const currentInput = ref('');
  const cursorActive = ref(true);
  const hiddenInput = ref(null);
  const outputRef = ref(null);
  const commandIndex = ref(0);
  const charIndex = ref(0);
  const isUserInputEnabled = ref(false);
  const editorInstance = ref(null);
  const { isDarkTheme } = useTheme();

  const commands = [
    'echo "Hola!👋 me llamo Carles"',
    'echo "Bienvenido a mi curriculum interactivo"',
    'echo "Soy un apasionado del diseño y desarrollo web 👨🏻‍💻"',
    'echo "Mi especialidad es el Front end"',
  ];  
  
  const typeCommand = () => {
    if (commandIndex.value < commands.length) {
      if (charIndex.value < commands[commandIndex.value].length) {
        currentInput.value += commands[commandIndex.value].charAt(charIndex.value);
        charIndex.value++;
        setTimeout(typeCommand, 100);
      } else {
        const fullCommand = commands[commandIndex.value];
        const finalText = fullCommand.slice(5).replace(/^"|"$/g, '');
        outputLines.value.push(finalText);
        
        setTimeout(() => {
          currentInput.value = '';
          setTimeout(() => {
            commandIndex.value++;
            typeCommand();
          }, 500);
        }, 1500);
        
        charIndex.value = 0;
      }
    } else {
      outputLines.value.push(' ');
      outputLines.value.push('Terminal lista para recibir comandos. 🚀');
      outputLines.value.push('Escribe "help" para ver los comandos disponibles.');
      isUserInputEnabled.value = true;
    }
    scrollToBottom();
  };
  
  const processUserCommand = (input) => {
    if (typeof input !== 'string') {
      return;
    }
    switch (input.toLowerCase()) {
      case 'help':
        outputLines.value.push(' - 🚨 help');
        outputLines.value.push(' - 💼 experience');
        outputLines.value.push(' - 💻 projects');
        outputLines.value.push(' - 📄 download_cv');
        outputLines.value.push(' - 📩 contact');
        outputLines.value.push(' - ❌ clear');
        break;
      case 'experience':
        outputLines.value.push('TODO: link per veure la meva trajectoria professional');
        minimizeTerminal()
        break;
      case 'projects':
        outputLines.value.push('TODO: link per veure els meus projectes');
        break;
      case 'contact':
        outputLines.value.push('TODO: link per veure un formulari de contacte');
        break;
      case 'download_cv':
        outputLines.value.push('TODO: descarga del meu cv');
        break;
      case 'clear':
        outputLines.value = [];
        break;
      default:
        outputLines.value.push('Comando no reconocido: input}');
    }
    scrollToBottom();
  };
  
  const handleKeyPress = (event) => {
    if (!isUserInputEnabled.value) return;
  
    event.preventDefault();
  
    if (event.key === 'Enter') {
      if (currentInput.value.trim() !== '') {
        outputLines.value.push(currentInput.value);
        processUserCommand(currentInput.value);
        currentInput.value = '';
      }
    } else if (event.key === 'Backspace') {
      currentInput.value = currentInput.value.slice(0, -1);
    } else if (event.key.length === 1) {
      currentInput.value += event.key;
    }
    scrollToBottom();
  };
  
  const blinkCursor = () => {
    cursorActive.value = !cursorActive.value;
    setTimeout(blinkCursor, 500);
  };
  
  const scrollToBottom = () => {
    nextTick(() => {
      const outputEl = outputRef.value;
      if (outputEl) {
        outputEl.scrollTop = outputEl.scrollHeight;
      }
    });
  };
  
  const focusHiddenInput = () => {
    if (hiddenInput.value) {
      hiddenInput.value.focus();
    }
  };
  
  const minimizeTerminal = () => {
    const terminal = document.querySelector('.terminal');
    terminal.classList.add('terminal-minimized');
  };
  
  const maximizeTerminal = () => {
    const terminal = document.querySelector('.terminal');
    terminal.classList.remove('terminal-minimized');
  }

  const handleTouchStart = (event) => {
  nextTick(() => {
    const terminalPane = document.querySelector('.terminal-pane');
    if (terminalPane && terminalPane.contains(event.target)) {
      focusHiddenInput();
    }
  })
  }

const handleResize = () => {
  setTimeout(() => {
    scrollToBottom()
  }, 300)
}

  onMounted(() => {
    focusHiddenInput();
    typeCommand();
    blinkCursor();
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('keydown', handleKeyPress)
    window.addEventListener('resize', handleResize)
  })

  onBeforeUnmount(() => {
    if (editorInstance.value) {
      editorInstance.value.dispose();
    }
  })
  </script>
  
  <style lang="postcss">
   .terminal-minimized {
    @apply fixed bottom-0 right-0 w-1/3 h-20 transition-all duration-300 z-20;
  }

  .terminal-pane {
    @apply w-full h-full overflow-auto;
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
import { onMounted } from 'vue';
import { tsParticles } from 'tsparticles-engine';
import { loadImageShape } from 'tsparticles-shape-image';
import { loadSlim } from 'tsparticles-slim';
import { detectDevice } from '../utils/common'
import { useTheme } from '~/composables/useTheme';

const { isDarkTheme } = useTheme()
const particlesOptions = {
  fullScreen: {
    enable: true,
    zIndex: -1,
  },
  particles: {
    number: {
      value: detectDevice() === 'desktop' ? 50 : 10
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
  
  
    
`