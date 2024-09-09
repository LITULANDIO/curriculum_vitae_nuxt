<template>
    <div>
        <form @submit.prevent="submitForm">
        <div>
            <label for="email">Email:</label>
            <input type="email" v-model="email" id="email" required />
        </div>
        <div>
            <label for="subject">Subject:</label>
            <input type="text" v-model="subject" id="subject" required />
        </div>
        <div>
            <label for="message">Message:</label>
            <textarea v-model="message" id="message" required></textarea>
        </div>
        <button type="submit">Send</button>
        <div v-if="responseMessage">{{ responseMessage }}</div>
        </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useFetch } from 'nuxt/app';
  
  const email = ref('');
  const subject = ref('');
  const message = ref('');
  const responseMessage = ref('');
  
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
      }
    } catch (error) {
      responseMessage.value = 'An error occurred. Please try again.';
    }
  };
  </script>
  