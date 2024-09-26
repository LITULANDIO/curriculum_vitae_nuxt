<template>
    <transition
      enter-active-class="transition-opacity duration-500"
      leave-active-class="transition-opacity duration-500"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
    <div v-if="visible" class="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 group-hover:block z-50" 
    :class="[isBlinkToolTip ? 'opacity-100' : 'opacity-0']"
    :style="{ top: styleTop, left: styleLeft }" >
    <div class="relative bg-gray-700 text-white text-sm rounded py-2 px-3">
     {{ text }}
      <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-t-8 border-t-gray-700 border-x-8 border-x-transparent"></div>
    </div>
  </div>
    </transition>
</template>

<script setup>
import { ref, defineProps, onMounted, nextTick, computed } from 'vue'
const styleTop = ref('0')
const styleLeft = ref('0')

const props = defineProps({
    text: String,
    visible: Boolean,
    elementTop: Object,
    isBlinkToolTip: Boolean,
    blink: Function
})

const isMobile = computed(() => process.client && window.innerWidth < 515)


onMounted(() => {
    props.blink()
    nextTick(() => {
        if (props.elementTop) {
            styleTop.value = isMobile.value ? 
            `${String(props.elementTop.getBoundingClientRect().top.toFixed(0) -15)}px` :
            `${String(props.elementTop.getBoundingClientRect().top.toFixed(0) -10)}px`
            
            styleLeft.value = isMobile.value ? 
            `${String(props.elementTop.getBoundingClientRect().right.toFixed(0) -20)}px` :
            `${String(props.elementTop.getBoundingClientRect().top.toFixed(0) -10)}px`
        }
    })
})


</script>