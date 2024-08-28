import { ref } from 'vue';

const isDarkTheme = ref(true)

export const useTheme = () => {
  const toggleTheme = () => {
    isDarkTheme.value = !isDarkTheme.value
  };

  return { isDarkTheme, toggleTheme }
}
