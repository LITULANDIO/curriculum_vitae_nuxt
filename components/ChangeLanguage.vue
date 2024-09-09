<template>
    <div>
      <button class="focus:outline-none absolute m-4 z-10 rounded-full ml-14" @click="toggleLanguage">
        <img :src="currentLanguageIcon" alt="Toggle Language" width="33"/>
      </button>
    </div>
  </template>
  
  <script setup>
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { useTheme } from '~/composables/useTheme';

  // Obtenemos el método `t` y el objeto `i18n` desde `useI18n`
  const { locale } = useI18n()
  const { isDarkTheme } = useTheme();

  // Computamos el ícono según el idioma actual
  const currentLanguageIcon = computed(() =>
   isDarkTheme.value ? '/assets/world-white.svg' : '/assets/world.svg'
  )
  
  // Función para alternar entre inglés y español
  const toggleLanguage = () => {
    locale.value = locale.value === 'en' ? 'es' : 'en'
  }
  </script>
  
  <style scoped>
  /* Puedes agregar estilo personalizado aquí */
  button {
    background: none;
    border: none;
    cursor: pointer;
  }
  </style>
  