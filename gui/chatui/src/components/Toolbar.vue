<template>
  <div class="toolbar-container">
    <IconCopy @click="emits('copy')" />
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits(['copy'])

</script>

<style lang="scss">
.toolbar-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 0 5px 5px 0;
  svg {
    padding: 3px;
    border-radius: 3px;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
