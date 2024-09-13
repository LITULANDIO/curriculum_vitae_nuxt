<template>
  <div 
    class="detail-container absolute font-mono text-xs md:text-base z-20"  
    :class="[isDarkTheme ? 'bg-black text-white border-[#ddd]' : 'bg-white text-black border-[#ddd]']"
    >
    <h2 class="font-bold mb-1">{{ event.text }}</h2>
    <p>{{ translateDescription}}</p>
    <button 
    class="back-arrow font-mono text-xs md:text-base transition-transform transform hover:scale-105 active:scale-95" @click="$emit('goBack')"
    :class="[isDarkTheme ? 'bg-white text-black' : 'bg-black text-white']"
    >{{ $t('card-detail.back') }}</button>
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

<style scoped>
.detail-container {
  position: relative;
  padding: 20px;
  width: 70%;
  margin: auto;
  padding: 15px;
  border-radius: 15px;
  border: 1px solid;
  top: -15rem;
  @media (max-width: 795px) {
      width: 100%;
      top: 20rem;
    }
}

.back-arrow {
  margin-top: 20px;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}
</style>