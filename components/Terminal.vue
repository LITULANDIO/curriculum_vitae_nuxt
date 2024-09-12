<template>
  <div ref="terminalPane" class="inset-0 flex items-center justify-center">
    <div ref="terminalContainer" class="mx-auto w-full max-w-[600px]  px-[10px] h-auto absolute z-10 terminal-container" @click="focusHiddenInput" @touch="focusHiddenInput">
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
          :class="[isDarkTheme ? 'text-black' : 'text-white']">{{ $t('terminal.header') }}</div>
        </div>
        <div
          class="absolute top-[25px] left-0 right-0 bottom-0 rounded-b-[10px] z-0"
          :class="[isDarkTheme ? 'bg-black' : 'bg-white']"
          >
        </div>
        <div ref="outputRef" class="relative z-20 flex-1 overflow-y-auto p-2.5 whitespace-pre-wrap pb-2.5 text-xs md:text-base max-h-[350px]"> <!-- Control de tamaño de fuente y altura máxima -->
          <div v-for="(line, index) in translatedOutputLines" :key="index">
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
  import { ref, onMounted, nextTick, onBeforeUnmount, defineEmits } from 'vue';
  import { useTheme } from '~/composables/useTheme';
  import { useI18n } from 'vue-i18n'

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
  const { t, locale } = useI18n()
  const terminalContainer = ref(null)

  const emit = defineEmits(['showTimeLineExperience', 'showTimeLineAcademy', 'showFormContact'])

  const commands = computed(() => [
  t('terminal.commands1'),
  t('terminal.commands2'),
  t('terminal.commands3'),
  t('terminal.commands4')
]);


  const typeCommand = () => {
    if (commandIndex.value < commands.value.length) {
      if (charIndex.value < commands.value[commandIndex.value].length) {
        currentInput.value += commands.value[commandIndex.value].charAt(charIndex.value);
        charIndex.value++;
        setTimeout(typeCommand, 100);
      } else {
        const fullCommand = commands.value[commandIndex.value];
        outputLines.value.push(fullCommand);
        
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
      outputLines.value.push(' ')
      outputLines.value.push('terminal.commands5');
      outputLines.value.push('terminal.commands6');
      isUserInputEnabled.value = true;
    }
    scrollToBottom();
  };

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

  const sendEmiterShowTimeLineExperience = () => {
    emit('showTimeLineExperience', true)
  }
  const sendEmiterHiddenTimeLineExperience = () => {
    emit('showTimeLineExperience', false)
  }
  const sendEmiterShowContactForm = () => {
    emit('showFormContact', true)
  }
  const sendEmiterHiddenContactForm = () => {
    emit('showFormContact', false)
  }
  const sendEmiterShowTimelineAcademy = () => {
    emit('showTimeLineAcademy', true)
  }
  const sendEmiterHiddenTimelineAcademy = () => {
    emit('showTimeLineAcademy', false)
  }

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = '/api/pdf';
    link.download = 'cv_litus.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const processUserCommandES = (input) => {
    if (typeof input !== 'string') {
      return;
    }
    switch (input.toLowerCase()) {
      case 'ayuda': 
        outputLines.value.push('terminal.help1', 'terminal.help2', 'terminal.help7', 'terminal.help3', 'terminal.help4', 'terminal.help5', 'terminal.help6')
        sendEmiterHiddenTimeLineExperience()
        sendEmiterHiddenContactForm()
        sendEmiterHiddenTimelineAcademy()
        break;
      case 'experiencia':
        sendEmiterShowTimeLineExperience()
        sendEmiterHiddenContactForm()
        sendEmiterHiddenTimelineAcademy()
        outputLines.value.push('terminal.commands10');
        hiddenInput.value.blur()
        break;
      case 'formacion': 
        sendEmiterShowTimelineAcademy()
        sendEmiterHiddenTimeLineExperience()
        sendEmiterHiddenContactForm()
        outputLines.value.push('terminal.commands11');
        hiddenInput.value.blur()
        break;
      case 'proyectos':
        window.open('https://github.com/LITULANDIO', '_blank');
        outputLines.value.push('terminal.commands8');
        sendEmiterHiddenTimeLineExperience()
        sendEmiterHiddenContactForm()
        sendEmiterHiddenTimelineAcademy()
        break;
      case 'contacto':
        sendEmiterShowContactForm()
        sendEmiterHiddenTimeLineExperience()
        sendEmiterHiddenTimelineAcademy()
        break;
      case 'descargar_cv':
        downloadPDF()
        outputLines.value.push('terminal.commands9');
        sendEmiterHiddenTimeLineExperience()
        sendEmiterHiddenContactForm()
        sendEmiterHiddenTimelineAcademy()
        break;
      case 'limpiar':
        sendEmiterHiddenTimeLineExperience()
        sendEmiterHiddenContactForm()
        sendEmiterHiddenTimelineAcademy()
        outputLines.value = [];
        break;
      default:
        outputLines.value.push(`${t('terminal.commands7', {input})}`);
    }
    scrollToBottom();
  };

  const processUserCommandEN = (input) => {
    if (typeof input !== 'string') {
      return;
    }
    switch (input.toLowerCase()) {
      case 'help':
        outputLines.value.push('terminal.help1', 'terminal.help2', 'terminal.help7', 'terminal.help3', 'terminal.help4', 'terminal.help5', 'terminal.help6')
        sendEmiterHiddenTimeLineExperience()
        sendEmiterHiddenTimelineAcademy()
        sendEmiterHiddenContactForm()
        break;
      case 'experience':
        sendEmiterShowTimeLineExperience()
        sendEmiterHiddenTimelineAcademy()
        sendEmiterHiddenContactForm()
        outputLines.value.push('terminal.commands10');
        hiddenInput.value.blur()
        break;
      case 'academy': 
        sendEmiterHiddenTimeLineExperience()
        sendEmiterHiddenTimeLineExperience()
        sendEmiterHiddenContactForm()
        outputLines.value.push('terminal.commands11');
        hiddenInput.value.blur()
        break;
      case 'projects':
        window.open('https://github.com/LITULANDIO', '_blank');
        outputLines.value.push('terminal.commands8');
        sendEmiterHiddenTimeLineExperience()
        sendEmiterHiddenTimelineAcademy()
        sendEmiterHiddenContactForm()
        break;
      case 'contact':
        sendEmiterShowContactForm()
        sendEmiterHiddenTimeLineExperience()
        sendEmiterHiddenTimelineAcademy()
        break;
      case 'download_cv':
        downloadPDF()
        outputLines.value.push('terminal.commands9');
        sendEmiterHiddenTimeLineExperience()
        sendEmiterHiddenTimelineAcademy()
        sendEmiterHiddenContactForm()
        break;
      case 'clear':
        sendEmiterHiddenTimeLineExperience()
        sendEmiterHiddenTimelineAcademy()
        sendEmiterHiddenContactForm()
        outputLines.value = [];
        break;
      default:
        outputLines.value.push(`${t('terminal.commands7', {input})}`);
    }
    scrollToBottom();
  };
  
  const handleKeyPress = (event) => {
    if (!isUserInputEnabled.value) return;
    event.preventDefault();

    if (event.key === 'Enter') {
      if (currentInput.value.trim() !== '') {
        outputLines.value.push(currentInput.value);
        if (locale.value === 'en') {
          processUserCommandEN(currentInput.value)
        } else {
          processUserCommandES(currentInput.value);
        }
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
      window.scrollTo(0, 50);
    }
  })
  }

const handleResize = () => {
  setTimeout(() => {
    scrollToBottom()
  }, 300)
}

  onMounted(() => {
    console.log(locale.value)
    typeCommand();
    blinkCursor();
    terminalContainer.value.addEventListener('touchstart', handleTouchStart)
    terminalContainer.value.addEventListener('keydown', handleKeyPress)
    window.addEventListener('resize', handleResize)
  })

  onBeforeUnmount(() => {
    if (editorInstance.value) {
      editorInstance.value.dispose();
    }
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