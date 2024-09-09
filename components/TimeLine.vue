<template>
    <div class="timeline-wrap">
      <button
        class="timeline-nav-button timeline-nav-button--prev transition-transform transform hover:scale-105 active:scale-95"
        @click="prev"
        :disabled="currentIndex === 0"
      >
      <img src="/assets/arrow-left.svg" alt="Prev" class="w-5 h-5" />
      </button>
  
      <div class="timeline">
        <div class="timeline-items" :style="{ transform: `translateX(${currentTranslate}px)`, height: '300px' }">
          <div 
            v-for="(event, index) in experience" 
            :key="index" 
            class="timeline-item"
            :class="{ 'timeline-item--bottom': index % 2 !== 0 }"
          >
            <div 
            class="timeline-content font-mono text-xs md:text-base" 
            :class="[isDarkTheme ? 'bg-black text-white dark-theme' : 'bg-white text-black']"
            @click="onSelectExperience(event)">
              <h2 class="font-bold">{{ event.year }}</h2>
              <div class="flex items-center">
                  <img :src="event.img" class="w-10 h-10"/>
                  <p class="ml-2">{{ event.text }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="timeline-divider"></div>
        <div class="timeline-points">
          <div 
            v-for="(event, index) in experience" 
            :key="'point-' + index" 
            class="timeline-point"
            :style="{ left: `${index * itemWidth + itemWidth / 2}px` }"
          ></div>
        </div>
      </div>
  
      <button
        class="timeline-nav-button timeline-nav-button--next transition-transform transform hover:scale-105 active:scale-95"
        @click="next"
        :disabled="currentIndex >= experience.length - visibleItems"
      >
      <img src="/assets/arrow-right.svg" alt="Prev" class="w-5 h-5" />
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, defineProps, defineEmits } from 'vue';
  import { useTheme } from '~/composables/useTheme';

  const props = defineProps({
    experience: {
        type: Array,
        default: [{ year: '', text: '' }]
    }
  })
  const emit = defineEmits(['selectExperience'])
  const currentIndex = ref(0);
  const itemWidth = 300;
  const visibleItems = 2;
  const currentTranslate = computed(() => -currentIndex.value * itemWidth);
  const { isDarkTheme } = useTheme();

  const onSelectExperience = (event) => emit('selectExperience', event)
  
  const prev = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--;
    }
  }
  
  const next = () => {
    if (currentIndex.value < props.experience.length - visibleItems) {
      currentIndex.value++;
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .timeline-wrap {
    display: flex;
    justify-content: center;
    align-items: center ;
    padding: 20px;
    width: 60%;
    position: absolute;
    top: 20px;
    left: 10%;
    transform: translate(-20%, -20%);
    z-index: 2;
    @media (max-width: 795px) {
      width: 100%;
      top: 50px;
      left: 0%;
      padding: 10px;
    }
  }
  
  .timeline {
    position: relative;
    width: 80%;
    overflow: hidden;
  }
  
  .timeline-items {
    display: flex;
    transition: transform 0.8s ease;
  }
  
  .timeline-item {
    width: 300px; 
    position: relative;
    flex-shrink: 0;
    top: 115px;
  }
  
  .timeline-item--bottom .timeline-content {
    margin-left: 30px;
    position: relative;
    top: 60px;
  }
  
  .timeline-item--bottom .timeline-content::before {
    content: '';
    position: absolute;
    left: 115px;
    width: 0;
    height: 0;
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent #ddd  transparent;
    transform: rotate(180deg);
    top: -20px !important;
  }
  .timeline-item--bottom .dark-theme.timeline-content::before {
    content: '';
    position: absolute;
    left: 115px;
    width: 0;
    height: 0;
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent white transparent;
    transform: rotate(180deg);
    top: -20px !important;
  }
  
  .timeline-item .timeline-content {
    margin-left: 30px;
    position: relative;
    bottom: 74px;
    @media (max-width: 795px) {
      width: 240px;
    }
  }
  
  .timeline-item .timeline-content::before {
    content: '';
    position: absolute;
    left: 115px;
    width: 0;
    height: 0;
    border-width: 10px;
    border-style: solid;
    border-color: #ddd transparent transparent transparent;
    top: 84px;
    @media (max-width: 795px) {
      top: 77px;
    }
  }

  .timeline-item .dark-theme.timeline-content::before {
    content: '';
    position: absolute;
    left: 115px;
    width: 0;
    height: 0;
    border-width: 10px;
    border-style: solid;
    border-color: white transparent transparent transparent;
    top: 84px;
    @media (max-width: 795px) {
      top: 77px;
    }
  }
  
  .timeline-content {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
  }
  
  .timeline-divider {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 4px;
    background-color: #ddd;
    transform: translateY(-50%);
    z-index: 1;
    margin-left: 3px;
    margin-right: 3px;
  }
  
  .timeline-nav-button {
    background-color: #fff;
    border: 2px solid #ddd;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
  }
  
  .timeline-nav-button:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  
  .timeline-points {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    transform: translateY(-50%);
  }
  
  .timeline-point {
    width: 12px;
    height: 12px;
    background: #ddd;
    border-radius: 50%;
    position: absolute;
    top: -6px;
  }
  </style>
  