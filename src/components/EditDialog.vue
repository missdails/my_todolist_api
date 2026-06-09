<template>
  <el-dialog v-model="visible" title="编辑待办事项" width="30%">
    <el-form :model="dialogParams">
      <el-form-item label="待办事项">
        <el-input v-model="dialogParams.content" />
      </el-form-item>
      <el-form-item label="完成时间">
        <el-date-picker 
          v-model="dialogParams.targetDate" 
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface TodoItem {
  id: number
  content: string
  targetDate: string
  createTime: string
  status: number
  completedTime?: string
}

const props = defineProps<{
  visible: boolean
  params: TodoItem
}>()

const emit = defineEmits(['update:visible', 'save'])

const visible = ref(false)
const dialogParams = ref<TodoItem>({ ...props.params })

watch(() => props.visible, (val) => {  
//监听父组件传递过来的props.dialogVisible，当props.dialogVisible变化时，将最新的props.dialogVisible赋值给val（新值）
  visible.value = val  //然后将新值赋值给子组件的变量visible
  if (val) {  //当val为true时，将父组件传递过来的props.dialogParams解构赋值给子组件的dialogParams.value
    dialogParams.value = { ...props.params }
  }
})

watch(visible, (val) => { //监听（子组件的）visible，当visible变化时，将其新值赋值给val
  if (!val) {  //当val为false时，将子组件的val值通过update:visible事件传递给父组件
    emit('update:visible', val)
  }
})

const handleSave = () => {  
  emit('save', dialogParams.value)  //子组件通过save事件，将dialogParams.value传递给父组件
  visible.value = false
}
</script>