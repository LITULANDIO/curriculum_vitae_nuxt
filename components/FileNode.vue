<template>
  <div class="file-tree w-64 overflow-auto md:h-full md:overflow-y-auto"
    :class="[isDarkTheme ? 'shadow-shadow-white bg-[#2d2d2d] text-white' : 'shadow-shadow-dark bg-white text-black']"
  >
    <ul class="list-none pl-5">
      <li v-for="node in nodes" :key="node.id">
        <div
          class="file-tree_content flex items-center py-1.5 font-mono cursor-pointer hover:text-green-400 text-sm"
          :class="{ 'font-bold text-green-400': isSelected(node) }"
          @click="selectNode(node)"
        >
          <img v-if="node.children" width="20" :src="isDarkTheme ? iconFolderDark(node) : iconFolderWhite(node)" class="mr-2" />
          {{ node.label }}
        </div>
        <ul v-if="node.open && node.children" class="pl-5">
          <li v-for="child in node.children" :key="child.id">
            <div
              class="file-tree_content flex items-center py-1.5 font-mono cursor-pointer hover:text-green-400 text-sm"
              :class="{ 'font-bold text-green-400': isSelected(child) }"
              @click.stop="selectNode(child)"
            >
              <img v-if="child.children" width="20" :src="isDarkTheme ? iconFolderDark(child) : iconFolderWhite(child)" class="mr-2" />
              {{ child.label }}
            </div>
            <ul v-if="child.open && child.children" class="pl-5">
              <li v-for="grandchild in child.children" :key="grandchild.id">
                <div
                  class="file-tree_content flex items-center py-1.5 font-mono cursor-pointer hover:text-green-400 text-sm"
                  :class="{ 'font-bold text-green-400': isSelected(grandchild) }"
                  @click.stop="selectNode(grandchild)"
                >
                  {{ grandchild.label }}
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  import { useTheme } from '~/composables/useTheme';
  const { isDarkTheme } = useTheme();

  const props = defineProps({
    nodes: Array,
    selectedFileId: Number
  });
  
  const emit = defineEmits(['selectNode']);
  
  const selectNode = (node) => {
    if (node.children) {
      node.open = !node.open;
    }
    emit('selectNode', node);
  };

  const iconFolderWhite = node => node.open ? '/assets/folder-open-dark.svg' : '/assets/folder-dark.svg'
  const iconFolderDark = node => node.open ? '/assets/folder-open.svg' : '/assets/folder.svg'
  const isSelected = node => node.id === props.selectedFileId;
  </script>
  
  <style lang="postcss">
  .shadow-custom {
    @apply shadow-none;
    box-shadow: -5px 0px 10px rgba(255, 255, 255, 0.5);
  }
</style>