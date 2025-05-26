<template>
  <div class="svg-icon" v-html="svgContent" :class="iconClass"></div>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  iconClass: {
    type: String,
    default: ''
  }
})

const svgContent = ref('')

// Load SVG content when component mounts or name changes
watch(() => props.name, async (newName) => {
  if (newName) {
    try {
      const response = await fetch(`/icons/${newName}.svg`)
      let content = await response.text()
      
      // Replace hardcoded colors with currentColor to make it CSS-styleable
      content = content.replace(/stroke="#FF0000"/g, 'stroke="currentColor"')
      content = content.replace(/fill="#FF0000"/g, 'fill="currentColor"')
      
      svgContent.value = content
    } catch (error) {
      console.error(`Error loading SVG: ${newName}`, error)
    }
  }
}, { immediate: true })
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  color: var(--border-color);
  transition: color 0.3s ease;
}

.svg-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.svg-icon:hover {
  color: #ff6666;
}
</style> 