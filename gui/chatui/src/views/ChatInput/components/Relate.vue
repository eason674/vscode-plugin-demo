<template>
  <div class="relate">
    <icon-plus :size="14" />
    <span>添加参考</span>
  </div>
</template>

<script setup></script>

<style lang="scss">
.relate {
  color: var(--vscode-editor-foreground);
  padding: 8px 12px;
  display: flex;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
  svg {
    padding: 5px;
    background: var(--vscode-editorWidget-background);
    border-radius: 3px;
  }
  span {
    margin: 0 0 0 10px;
    color: var(--vscode-editor-foreground);
  }
}
</style>
