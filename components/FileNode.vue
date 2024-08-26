<template>
    <div class="file-tree">
      <ul>
        <li v-for="node in nodes" :key="node.id">
          <div
            class="file-tree_content"
            :class="{ selected: isSelected(node) }"
            @click="selectNode(node)"
          >
            <img v-if="node.children" width="20" :src="node.open ? '/assets/folder-open.svg' : '/assets/folder.svg'" />
            {{ node.label }}
          </div>
          <ul v-if="node.open && node.children">
            <li v-for="child in node.children" :key="child.id">
              <div
                class="file-tree_content"
                :class="{ selected: isSelected(child) }"
                @click.stop="selectNode(child)"
              >
                <img v-if="child.children" width="20" :src="child.open ? '/assets/folder-open.svg' : '/assets/folder.svg'" />
                {{ child.label }}
              </div>
              <ul v-if="child.open && child.children">
                <li v-for="grandchild in child.children" :key="grandchild.id">
                  <div
                    class="file-tree_content"
                    :class="{ selected: isSelected(grandchild) }"
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
  import { defineProps, defineEmits, ref } from 'vue';
  
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
  
  const isSelected = (node) => node.id === props.selectedFileId;
  </script>
  
  <style lang="scss" scoped>
  .file-tree {
    background: #0000;
    color: #fff;
    width: 200px;
    height: 100vh;
    @media (max-width: 480px) {
        height: 200px;
        overflow-y: scroll;
    }
  
    &_content {
      display: flex;
      align-items: center;
      padding-bottom: 3px;
      font-family: 'monospace';
      cursor: pointer;
      img {
        padding-right: 10px;
      }
      &.selected {
        font-weight: bold;
        color: #28c940;
      }
    }
    ul {
      list-style-type: none;
      padding-left: 20px;
    }
  }
  </style>
  