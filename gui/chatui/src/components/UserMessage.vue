<template>
  <div class="user-message-container">
    <div class="title">我</div>
    <div class="_text">{{ item.content }}</div>
  </div>
</template>

<script setup>

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})
console.log(props.item,'item');

</script>

<style >
.user-message-container {
  padding: 0 10px ;
  background: var( --vscode-activityBar-background);
  border-radius: 5px;
  .title {
    font-weight: 600;
    padding: 8px 0;
    border-bottom: 1px solid var(--vscode-editorWidget-border);
  }
 ._text{
    padding: 10px 0;
 }
}
</style>