<template>
    <div>
        <button @click="toggleTheme" class="focus:outline-none absolute m-4 bg-white z-10 rounded-full">
            <img :src="isDarkTheme ? '/assets/moon_dark.svg' : '/assets/moon.svg'" alt="Toggle Theme" width="30" />
        </button>
    </div>
</template>

<script setup>
  import { useTheme } from '~/composables/useTheme';
  const { isDarkTheme, toggleTheme } = useTheme()
</script>