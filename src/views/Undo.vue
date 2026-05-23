<template>
  <el-table :data="store.undos" style="width: 100%">
    <el-table-column type="index" label="序号" width="80" />
    <el-table-column label="待办事项" prop="content" />
    <el-table-column label="创建时间" prop="createTime" />
    <el-table-column label="预期完成时间" prop="date" />
    <el-table-column label="操作" width="240" align="center">
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
  />
</template>
<script setup lang="ts">
import { useTodoStore } from '@/stores/todo.ts'
import {ref} from 'vue'
import EditDialog from '@/components/EditDialog.vue';

interface List{
         id:number|string,
    content: string,
       date: string,
 createTime:string
}
const store=useTodoStore()
const editDialog=ref(false)
const dialogParams=ref<List>({
         id:'',
    content: '',
       date: '',
 createTime:''
}
)

const handleEdit=(item:List)=>{ 
    console.log('编辑的 item:', item) //打开编辑窗，将该条数据的参数赋值给dialogParams（将通过:params="dialogParams"赋值给子组件）
    editDialog.value=true
    const index=store.undos.findIndex(i=>i.id===item.id)
    console.log('找到的原始数据:', store.undos[index])
    dialogParams.value = { ...store.undos[index] }
    console.log('editDialog的值',editDialog.value)
}
const handleUpdateDialog=(item:any)=>{  //更新编辑内容到Undo.vue组件
    const now=new Date()
    if(new Date(item.date).getTime()>now.getTime()){
        store.undoMoveTodo(item)
    }else{
        store.updateUndo(item)
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