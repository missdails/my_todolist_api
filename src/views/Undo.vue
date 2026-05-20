<template>
    <el-table :data="store.undos" style="width: 100%">
       <el-table-column type="index" label="序号" width="80px"/>
       <el-table-column label="待办事项" width="500px" prop="content" ></el-table-column>
       <el-table-column label="创建时间" prop="createTime" ></el-table-column>
       <el-table-column label="预期完成时间" prop="date" ></el-table-column>
       <el-table-column label="操作"  width="240px" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="success" size="small" @click="handleComplete(scope.row)">已完成</el-button>
                    <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>              
            </el-table-column>
    </el-table>
    <edit-dialog 
        v-model:visible="editDialog" 
        :params="dialogParams"
        @save="handleUpdateDialog"
    ></edit-dialog>
  
</template>
<script setup lang="ts">
import { useTodoStore } from '@/stores/todo.ts'
import {ref} from 'vue'

const store=useTodoStore()
const editDialog=ref(false)
const dialogParams=ref({})

const handleEdit=(item:any)=>{  //打开编辑窗，将该条数据的参数赋值给dialogParams（将通过:params="dialogParams"赋值给子组件）
    editDialog.value=true
    const index=store.undos.findIndex(i=>i.id===item.id)
    dialogParams.value = { ...store.undos[index] }
}
const handleUpdateDialog=(item:any)=>{  //更新编辑内容到Undo.vue组件
    const now=new Date()
    if(new Date(item.date).getTime()>now.getTime()){
        store.updateUndo(item)
    }else{
        store.undoMoveTodo(item)
    }
    
    editDialog.value=false
}
const handleComplete=(item:any)=>{  //将未完成的事项改为完成
    store.undoMoveDid(item)

}
const handleDelete=(id:number)=>{  //删除未完成事项
    store.deleteUndo(id)
}
   
</script>