<template>
  <div>
    <button @click="toggleTheme" class="focus:outline-none absolute m-4 bg-white z-10 rounded-full">
    <img :src="isDarkTheme ? '/assets/moon_dark.svg' : '/assets/moon.svg'" alt="Toggle Theme" width="30" />
  </button>
    <Particles />
    <SplitContainer />
  </div>
</template>

<script setup>
const { isDarkTheme, toggleTheme } = useTheme()

</script>

<style>
body {
  margin: 0;
}
</style>
