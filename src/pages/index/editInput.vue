<template>
  <div>
    <el-input v-if="isEdit" :type="type" :autosize="{ minRows: 2, maxRows: 6 }" v-model="_value" ></el-input >
    <div v-else class="text" @dblclick="editInput" >{{ props.modelValue }}</div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, watch, ref } from 'vue'

const props = defineProps({
  // 输入值
  modelValue: {
    type: String,
    default: '',
  },
  // 输入框类型
  type: {
    type: String,
    default: '',
  },
  // 是否可编辑
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const $emit = defineEmits(['update:modelValue'])

const _value = ref(props.modelValue)

watch(_value, (value) => {
  $emit('update:modelValue', value)
})

watch(() => props.isEdit, (value) => {
  if (value) {
    _value.value = props.modelValue
  }
})

</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.text {
  overflow: hidden;
  text-overflow: ellipsis;
  display:-webkit-box;
  -webkit-box-orient:vertical;
  -webkit-line-clamp:6;
}
</style>
