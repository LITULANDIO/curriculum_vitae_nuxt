<template>
  <div 
    class="detail-container relative p-5 md:w-[70%] mx-auto rounded-[15px] border border-solid top-[-10rem] md:top-[20rem] w-full font-mono text-xs md:text-base z-20"  
    :class="[isDarkTheme ? 'bg-black text-white border-[#ddd]' : 'bg-white text-black border-[#ddd]']"
  >
    <h2 class="font-bold mb-1">{{ event.text }}</h2>
    <p>{{ translateDescription }}</p>
    <button 
      class="back-arrow mt-5 p-2 rounded cursor-pointer font-mono text-xs md:text-base transition-transform transform hover:scale-105 active:scale-95"
      @click="$emit('goBack')"
      :class="[isDarkTheme ? 'bg-white text-black' : 'bg-black text-white']"
    >
      {{ $t('card-detail.back') }}
    </button>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { useTheme } from '~/composables/useTheme'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})
const { isDarkTheme } = useTheme()
const translateDescription = computed(() => t(props.event.description))

</script>
