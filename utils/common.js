
export const detectDevice = () => {
    if (process.client && window?.matchMedia("(max-width: 767px)")?.matches) {
      return "mobile";
    } else {
      return "desktop";
    }
  }

  export const fileTree = [
    {
      id: 1,
      label: 'src',
      open: true,
      children: [
        {
          id: 2,
          label: 'components',
          open: true,
          children: [
            { id: 3, label: 'Terminal.vue', type: 'file' },
            { id: 4, label: 'Particles.vue', type: 'file' },
            { id: 5, label: 'FileNode.vue', type: 'file' },
            { id: 6, label: 'CodeEditor.vue', type: 'file' },
            { id: 7, label: 'SplitContainer.vue', type: 'file' },
          ]
        },
        { id: 8, label: 'app.vue', type: 'file' }, 
      ]
    }
  ];
  