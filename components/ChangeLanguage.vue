<template>
    <div>
      <button class="focus:outline-none absolute m-4 z-10 rounded-full ml-14 bg-none border-none cursor-pointer" @click="toggleLanguage">
        <img :src="currentLanguageIcon" alt="Toggle Language" width="33"/>
      </button>
    </div>
  </template>
  
  <script setup>
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { useTheme } from '~/composables/useTheme';

  const { locale } = useI18n()
  const { isDarkTheme } = useTheme();

  const currentLanguageIcon = computed(() =>
   isDarkTheme.value ? '/assets/world-white.svg' : '/assets/world.svg'
  )
  
  const toggleLanguage = () => {
    locale.value = locale.value === 'en' ? 'es' : 'en'
  }
  </script>
  