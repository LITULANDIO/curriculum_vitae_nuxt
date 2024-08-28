<template>
  <div ref="terminalPane" class="inset-0 flex items-center justify-center overflow-auto terminal-pane">
    <div class="mx-auto relative z-10 w-full max-w-[600px] h-auto"> <!-- Ancho fijo con un máximo de 600px -->
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
            @blur="focusHiddenInput"
            @keyup.enter="processUserCommand"
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

// const dark = computed(() => isDarkTheme.value)
  
  
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
        outputLines.value.push(`Comando no reconocido: ${input}`);
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
    if (event.target.closest('.terminal-pane')) {
      focusHiddenInput()
    }
  });
};

const handleResize = () => {
  setTimeout(() => {
    scrollToBottom()
  }, 300)
}

  onMounted(() => {
    focusHiddenInput();
    typeCommand();
    blinkCursor();
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('resize', handleResize)

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