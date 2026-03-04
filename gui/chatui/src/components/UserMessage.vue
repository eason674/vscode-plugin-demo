<template>
  <div class="user-message-container">
    <div>我</div>
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
 ._text{
    padding: 10px 0;
 }
}
</style>