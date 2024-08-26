export const detectDevice = () => {
    if (window?.matchMedia("(max-width: 767px)")?.matches) {
      return "mobile";
    } else {
      return "desktop";
    }
  }

  export const code = `
  <template>
    <div class="split-container">
      <div ref="terminalPane" class="pane terminal-pane">
        <div class="terminal-container">
          <div class="terminal">
            <div class="terminal-header">
              <div class="header-buttons">
                <span class="button close"></span>
                <span @click="minimizeTerminal" class="button minimize"></span>
                <span @click="maximizeTerminal" class="button maximize"></span>
              </div>
              <div class="header-title">Terminal de Comandos</div>
            </div>
            <div class="terminal-background"></div>
            <div class="output" ref="outputRef">
              <div :id="line.replace(' -  ', '')" v-for="(line, index) in outputLines" :key="index">{{ line }}</div>
            </div>
            <div class="input-area">
              <span class="prompt">$ </span>
              <input
                ref="hiddenInput"
                v-model="currentInput"
                class="hidden-input"
                @blur="focusHiddenInput"
                @keyup.enter="processUserCommand"
              />
              <span class="input-text">{{ currentInput }}</span>
              <span class="cursor" :class="{ active: cursorActive }">|</span>
            </div>
          </div>
        </div>
      </div>
      <div ref="editorContainer" class="editor-container"></div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
  import { EditorState } from "@codemirror/state";
  import { EditorView, basicSetup } from "@codemirror/basic-setup";
  import { javascript } from "@codemirror/lang-javascript";
  
  const outputLines = ref([]);
  const currentInput = ref('');
  const cursorActive = ref(true);
  const hiddenInput = ref(null);
  const outputRef = ref(null);
  const commandIndex = ref(0);
  const charIndex = ref(0);
  const isUserInputEnabled = ref(false);
  const editorContainer = ref(null);
  const editorInstance = ref(null);
  
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
      outputLines.value.push('');
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
        minimizeTerminal();
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
        outputLines.value.push('Comando no reconocido: ....');
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
  };
  
  onMounted(() => {
    focusHiddenInput();
    typeCommand();
    blinkCursor();
 
    nextTick(() => {
      Split(['.terminal-pane', '.editor-container'], {
        sizes: [80, 20], 
        minSize: [300, 200], 
        expandToMin: true,
        direction: 'horizontal',
        dragInterval: 10,
        cursor: 'col-resize',
        gutterAlign: 'center'
      });
    });
  });
  </script>
  `;

