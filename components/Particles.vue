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
