<template>
    <el-card shadow="hover">
        <el-row :gutter="20">
            <el-col :span="12">
                <el-form :model="params" :rules="rules" ref="formRef">
                <el-form-item label="添加待办事项：" prop="content">
                    <el-input v-model="params.content" placeholder="请输入待办事项内容"/>
                </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="6">
                <el-form :model="params" :rules="rules" ref="dateRef">
               <el-form-item label="请设置完成时间：" prop="date">
                   <el-date-picker
                       v-model="params.date"
                       type="datetime"
                       placeholder="预计完成时间"
                       value-format="YYYY-MM-DD HH:mm:ss"
                    />
                </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="6">
                <el-button type="primary" @click="onSubmit">提交</el-button>
            </el-col>
        </el-row>
    </el-card >
    <el-card class="mt">
      <div>
        <el-button plain :disabled="selectedIds.length===0" @click="handleComplete()" >选择待办事项，点此确认已完成</el-button>
      </div>
    </el-card>
    <el-card class="mt">
    <el-table :data="store.todos" style="width: 100%" @selection-change="handleSelectionChange" row-key="id">
    <el-table-column type="selection"  width="55"  />
    <el-table-column type="index" label="序号" width="80"> 
    </el-table-column>
    <el-table-column label="待办事项" width="500px" prop="content" ></el-table-column>
    <el-table-column label="预期完成时间" prop="targetDate" ></el-table-column>
    <el-table-column label="创建时间" prop="createTime" ></el-table-column>
            <el-table-column label="操作" width="180px" >
                <template #default="scope">
                    <el-button type="primary" size="small" @click="handleEdit(scope.row.id)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>              
            </el-table-column>
        
  </el-table>
</el-card>
   <edit-dialog 
  :visible="editDialog" 
  :params="dialogParams"
  @save="handleUpdateDialog"
  @update:visible="editDialog = $event"></edit-dialog>
  <!--当子组件触发 update:visible 事件时，把事件($event)传递过来的新值赋值给父组件的 editDialog 变量。-->
  <!--:visible="editDialog" 和 @update:visible="editDialog = $event" 就相当于 v-model:visible="editDialog"实现组件间传值的双向绑定-->
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import {ElMessage, type FormInstance} from 'element-plus'
import EditDialog from '@/components/EditDialog.vue';
import {useTodoStore} from '@/stores/todo.ts'

const store=useTodoStore()

// 表单数据
const params=ref({
    content: '',
    date: ''
});
const selectedIds=ref<(string | number)[]>([])

const rules={
    content: [
    { required: true, message: '内容不能为空', trigger: 'blur' },
    { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
  ],
  date: [
    { required: true, message: '请输入完成时间', trigger: 'blur' },
  ],
}
const formRef=ref<FormInstance | undefined>()
const dateRef=ref<FormInstance | undefined>()

const onSubmit = async () => {
  //验证表单
  if (!formRef.value || !dateRef.value){
    ElMessage.warning('表单未初始化')
    return
  }
  try {
    await Promise.all([
      formRef.value.validate(),
      dateRef.value.validate()
    ])
     
  store.addTodo({
    content:params.value.content,
    date:params.value.date
  })
  //清空表单
      params.value={content:'',date:''}
      formRef.value?.resetFields()
      dateRef.value?.resetFields()
    }catch(error){
        console.log("验证有误",error)
      ElMessage.warning('请输入正确的内容！')
    }
  }

  const editDialog=ref(false)
  const dialogParams=ref({
          id: 0,
     content: '',
  targetDate: '',
  createTime: '',
  status: 0
  }) ;
  // 添加编辑保存的处理函数
const handleUpdateDialog = (updatedItem:any) => {
  store.updateTodoItem(updatedItem)
  editDialog.value = false
}

// 修改 handleEdit 函数
const handleEdit = (id:number|string) => {
    editDialog.value = true
    // 需要深拷贝，避免直接引用
    const index=store.todos.findIndex(i=>i.id===id)
    dialogParams.value = { ...store.todos[index] }
}
  const handleDelete=(id:number)=>{
    store.deleteTodoItem(id)
  }
 
  const handleSelectionChange=(selection:any[])=>{
     selectedIds.value =selection.map(item=>item.id!) //这里的！是非空断言符
     
  }
  const handleComplete=()=>{
     if(selectedIds.value.length>0){
         store.completeTodoItems(selectedIds.value)
         selectedIds.value=[]
     }
  }

  // 定时器ID
let timer: number | null = null
  // 定时检查过期任务
const scheduleExpiredCheck = () => {
  // 立即执行一次检查（组件挂载时）
  store.expiredHasTodos()
  
  // 设置定时器，每分钟检查一次
  timer = setInterval(() => {
    console.log('定时检查过期任务...')
    store.expiredHasTodos()
  }, 60 * 1000) // 60秒 = 1分钟
}

// 清除定时器
const clearSchedule = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
    console.log('已清除过期任务检查定时器')
  }
}

// 组件挂载
onMounted(async () => {
  // 加载待办数据
  await store.loadTodos()
  // 启动定时检查
  scheduleExpiredCheck()
})

// 组件卸载
onUnmounted(() => {
  clearSchedule()
})
</script>

<style scoped>

</style>