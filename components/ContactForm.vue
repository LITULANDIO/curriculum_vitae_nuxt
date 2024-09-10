<template>
  <transition name="detail">
    <div v-if="isVisible" class="relative w-full max-w-lg mx-auto p-6 shadow-md rounded-lg z-20 border border-solid top-[60px]" 
    :class="[isDarkTheme ? 'bg-black text-white border-white' : 'bg-white text-black border-black' ]">
    
      <button @click="$emit('close')" class="absolute top-2 right-2.5 text-lg font-bold focus:outline-none">
        &times;
      </button>
      
      <form @submit.prevent="submitForm" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Enter your email"
            class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 sm:text-sm"
            :class="[isDarkTheme ? 'text-black' : 'text-white']"
            required
          />
        </div>

        <div>
          <label for="subject" class="block text-sm font-medium">Subject</label>
          <input
            type="text"
            id="subject"
            v-model="subject"
            placeholder="Subject"
            class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
            :class="[isDarkTheme ? 'text-black' : 'text-white']"
            required
          />
        </div>

        <div>
          <label for="message" class="block text-sm font-medium">Message</label>
          <textarea
            id="message"
            v-model="message"
            placeholder="Write your message..."
            class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
            :class="[isDarkTheme ? 'text-black' : 'text-white']"
            rows="5"
            required
          ></textarea>
        </div>

        <div>
          <button
            type="submit"
            class="w-full py-2 px-4 rounded-md hover:scale-105 active:scale-95"
            :class="[isDarkTheme ? 'bg-white text-black border-white' : 'bg-black text-white']"
          >
            Send
          </button>
        </div>

        <div v-if="responseMessage" :class="{'text-red-500': responseMessage.includes('Failed'), 'text-green-500': responseMessage.includes('successfully')}" class="text-sm">
          {{ responseMessage }}
        </div>
      </form>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue';
import { useFetch } from 'nuxt/app';
import { useTheme } from '~/composables/useTheme';

const { isDarkTheme } = useTheme();

const email = ref('');
const subject = ref('');
const message = ref('');
const responseMessage = ref('');
const isShowForm = ref(false)

const props = defineProps({ isVisible: {type: Boolean, default: false }});

const submitForm = async () => {
  try {
    const { data, error } = await useFetch('/api/contact', {
      method: 'POST',
      body: {
        email: email.value,
        subject: subject.value,
        message: message.value,
      },
    });

    if (error.value) {
      responseMessage.value = 'Failed to send the message. Please try again.';
    } else {
      responseMessage.value = 'Message sent successfully!';
      setTimeout(() => {
        isShowForm.value = false
      })
    }
  } catch (error) {
    responseMessage.value = 'An error occurred. Please try again.';
  }
}
</script>

<style lang="postcss">
.detail-enter-active, .detail-leave-active {
  transition: all 0.8s ease;
}

.detail-enter-from, .detail-leave-to {
  opacity: 0;
  transform: translateY(50px) scale(0.8); /* Empieza desde abajo y con zoom reducido */
}

.detail-enter-to, .detail-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1); /* Termina en su posición normal con zoom normal */
}
</style>