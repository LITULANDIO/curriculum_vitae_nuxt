<template>
  <div class="split-container" v-if="currentFile">
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
    <FileNode 
      v-if="currentFile"
      :nodes="fileTree" 
      :selectedFileId="selectedFileId"
      @selectNode="loadFileContent"/>
    <MonacoEditor 
      v-if="currentFile === 'Terminal.vue'" 
      class="editor-container" 
      v-model="code1" 
      :lang="currentFileLang" 
      :options="{ theme: 'vs-dark' }"
    />
    <MonacoEditor 
      v-if="currentFile === 'Particles.vue'" 
      class="editor-container" 
      v-model="code2" 
      :lang="currentFileLang" 
      :options="{ theme: 'vs-dark' }"
    />
    <MonacoEditor 
      v-if="currentFile === 'file1.js'" 
      class="editor-container" 
      v-model="code3" 
      :lang="currentFileLang" 
      :options="{ theme: 'vs-dark' }"
    />    
  </div>
</template>

  
  <script setup>
  import { ref, onMounted, nextTick, onBeforeUnmount, watch } from 'vue';
  import Split from 'split.js';
  import { code } from '../utils/common'
  
  const outputLines = ref([]);
  const currentInput = ref('');
  const cursorActive = ref(true);
  const hiddenInput = ref(null);
  const outputRef = ref(null);
  const commandIndex = ref(0);
  const charIndex = ref(0);
  const isUserInputEnabled = ref(false);
  const editorInstance = ref(null);
  const currentFile = ref(null);
  const selectedFileId = ref(null);
  const currentFileLang = ref('php');
  const code1 = ref('')
  const code2 = ref('')
  const code3 = ref('')
  const splitInstance = ref(null);
  const splitSizes = ref([90, 10]);
  const fileTree = ref([
  {
    id: 1,
    label: 'src',
    open: true,
    children: [
      { id: 2, label: 'file1.js', type: 'file' },
      {
        id: 3,
        label: 'components',
        open: true,
        children: [
          { id: 4, label: 'Terminal.vue', type: 'file' },
          { id: 5, label: 'Particles.vue', type: 'file' },
        ]
      }
    ]
  }
])
const loadFileContent = (file) => {
  console.log(file)
  selectedFileId.value = file.id
  if (file.label === 'Terminal.vue') {
    code1.value = code
    currentFile.value = file.label
  } else if (file.label === 'Particles.vue') {
    code2.value = '// Código para file2.js'
    currentFile.value = file.label
  } else if (file.label === 'file1.js') {
    code3.value = "console.log('holix matrix')"
    currentFile.value = file.label
  }
  nextTick(() => {
    if (splitInstance.value) {
        splitInstance.value.destroy();
          splitInstance.value = Split(['.terminal-pane', '.editor-container'], {
          sizes: [50,50],
          minSize: [100, 100],
          direction: window.innerWidth <= 768 ? 'vertical' : 'horizontal',
          cursor: window.innerWidth <= 768 ? 'col-resize' : 'row-resize',
          gutterAlign: 'center',
          gutterSize: 10,
          gutterStyle: (dimension, gutterSize) => ({
            cursor: dimension === 'horizontal' ? 'row-resize' : 'col-resize', 
            backgroundColor: 'rgba(150, 150, 150, 0.7)',
        })
      })
    }
  })
}

const initializeDefaultFile = () => {
  if (selectedFileId.value === null) {
    const defaultFile = fileTree.value[0].children.find(child => child.type === 'file');
    if (defaultFile) {
      loadFileContent(defaultFile);
    }
  }
};

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

  const updateSplit = () => {
    splitInstance.value = Split(['.terminal-pane', '.editor-container'], {
      sizes: window.innerWidth <= 768 ? [90, 10] : splitSizes.value,
      minSize: [100, 100],
      direction: window.innerWidth <= 768 ? 'vertical' : 'horizontal',
      cursor: window.innerWidth <= 768 ? 'col-resize' : 'row-resize',
      gutterAlign: 'center',
      gutterSize: 10,
      gutterStyle: (dimension, gutterSize) => ({
        cursor: dimension === 'horizontal' ? 'row-resize' : 'col-resize',
        backgroundColor: 'rgba(150, 150, 150, 0.7)',
      }),
    });
};

  onMounted(() => {
    focusHiddenInput();
    typeCommand();
    blinkCursor();
    initializeDefaultFile()
    nextTick(() => {
      updateSplit()
    })
    window.addEventListener('touchstart', focusHiddenInput);
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('resize', () => {
      setTimeout(() => {
        scrollToBottom();
        if (splitInstance.value) {
          splitInstance.value.destroy();
          updateSplit()
        }
      }, 300);    
    })
  })

  onBeforeUnmount(() => {
    if (editorInstance.value) {
      editorInstance.value.dispose();
    }

  })
  </script>
  
  <style lang="scss">
  
  .monaco-editor {
    height: 100vh;
  }
  .cm-editor {
    height: 100vh;
  }
  .split-container {
    height: 100vh;
    display: flex;
  }
  
  .editor-container {
    height: 100%;
    width: 100%;
    position: relative;
    z-index: 100;
    background: #2d2d2d;
    color: white;
    position: relative;
  }

  .split {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}
  
.gutter {
  background-color: rgba(150, 150, 150, 0.7);
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  z-index: 999;
}

.gutter.gutter-horizontal {
  cursor: row-resize;
  height: 100vh !important;
  width: 20px !important;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
}

.gutter.gutter-vertical {
  cursor: col-resize;
  height: 20px !important;
  width: 100% !important;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
}

  .pane {
    overflow: auto;
    display: flex;
    justify-content: center;
  }
  .code-pane {
    flex: 1;
    background: #1e1e1e;
  }
  .code-editor {
    width: 100%;
    height: 100%;
    background: #2d2d2d;
    color: white;
    font-family: monospace;
  }
  
  .terminal-container {
    width: 25%;
    margin: auto;    
    position: relative;
    z-index: 100;
  }
  
  .terminal {
    position: relative;
    width: 600px;
    height: 425px;
    border-radius: 10px;
    color: #fff;
    padding: 0 0px;
    box-shadow:   
    0 0 10px rgba(255, 255, 255, 0.5),
      0 0 20px rgba(255, 255, 255, 0.4),
      0 0 30px rgba(255, 255, 255, 0.3);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: "Courier New", Courier, monospace;
    background-color: transparent;
    text-align: left;
  }
  
  .terminal-header {
    width: 100%;
    height: 30px;
    background-color: #fff;
    border-radius: 10px 10px 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    box-sizing: border-box;
    z-index: 1;
  }
  
  .header-buttons {
    display: flex;
    gap: 8px;
  }
  
  .button {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
  }
  
  .close {
    background-color: #ff5f57;
  }
  
  .minimize {
    background-color: #ffbd2e;
    display: block;
    cursor: pointer;
  }
  
  .maximize {
    background-color: #28c940;
    display: block;
    cursor: pointer;
  }
  
  .header-title {
    flex: 1;
    text-align: center;
    font-weight: bold;
    color: #333;
  }
  
  .terminal-background {
    position: absolute;
    top: 25px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 0 0 10px 10px;
    z-index: 0;
  }
  
  .output,
  .input-area {
    position: relative;
    z-index: 102;
  }
  
  .output {
    flex: 1;
    overflow-y: auto;
    white-space: pre-wrap;
    padding-bottom: 10px;
    padding: 10px;
  }
  
  .input-area {
    display: flex;
    align-items: center;
    padding: 10px;
  }
  
  .prompt {
    color: #00ff00;
    margin-right: 5px;
  }
  
  .input-text {
    flex: 1;
    outline: none;
    white-space: nowrap;
    overflow: hidden;
    color: #00ff00;
  }
  
  .cursor {
    display: inline-block;
    width: 10px;
    background-color: #00ff00;
    margin-left: 2px;
  }
  
  .cursor.active {
    opacity: 1;
  }
  
  .cursor:not(.active) {
    opacity: 0;
  }
  .hidden-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }
  .click-capture-layer {
    position: absolute;
    top: 259px;
    left: 0;
    width: 370px;
    height: 328px;
    z-index: 101;
    background-color: transparent;
  }
  .terminal-minimized {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 35%;
    height: 75px;
    transition: all 0.3s ease;
    z-index: 100;
  }
  
  @media (max-width: 768px) {
    .terminal {
      height: auto;
      width: 100%;
      max-width: 600px;
      height: 425px;
    }
  
    .terminal-header {
      height: 25px;
      font-size: 0.9rem;
    }
  
    .terminal-background {
      top: 20px;
    }
  
    .button {
      width: 10px;
      height: 10px;
    }
  
    .header-title {
      font-size: 0.8rem;
    }
  
    .output, .input-area {
      padding: 5px;
      font-size: 0.9rem;
    }
  
    .input-text {
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 480px) {
    .split-container {
    flex-direction: column; 
  }
    .pane {
      padding: 10px;
      margin-top: 3rem;
    }

    .terminal {
      height: auto;
      width: 370px;
      max-width: 400px;
      height: 325px;
    }
  
    .terminal-header {
      height: 20px;
      font-size: 0.8rem;
    }
    .terminal-background {
      top: 20px;
    }
    .terminal-container {
      width: 100%;
    }
    .button {
      width: 8px;
      height: 8px;
    }
  
    .header-title {
      font-size: 0.7rem;
    }
  
    .output, .input-area {
      padding: 8px;
      font-size: 0.8rem;
    }
  
    .input-text {
      font-size: 0.8rem;
    }
  }

  ul {
  list-style-type: none;
  padding-left: 20px;
}

li {
  cursor: pointer;
}
  </style>
  