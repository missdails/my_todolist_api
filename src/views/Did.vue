<template>
    <el-table :data="store.dids" style="width: 100%">
       <el-table-column type="index" label="序号" width="80px"/>
       <el-table-column label="待办事项" width="500px" prop="content" ></el-table-column>
       <el-table-column label="创建时间" prop="createTime" ></el-table-column>
       <el-table-column label="预期完成时间" prop="targetDate" ></el-table-column>
       <el-table-column label="实际完成时间" prop="completedTime" />
       <el-table-column label="操作"  width="100px">
                <template #default="scope">
                    <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>              
            </el-table-column>
    </el-table>
</template>
<script setup lang="ts">
import { useTodoStore } from '@/stores/todo'
import {onMounted} from 'vue'
const store=useTodoStore()
    
    const handleDelete=(id:number)=>{
        store.deleteDidItem(id)
    }
// 组件挂载
onMounted(async () => {
  // 加载已完成数据
  await store.loadDids()
})
</script>