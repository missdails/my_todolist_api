import { useGetCurrentTime } from "@/hooks/GetCurrentTime"
import { ElMessage } from "element-plus"
import {defineStore} from "pinia"
import {ref} from 'vue'

export interface TodoItem{
    id:number|string,
   content:string,
   date:string,
   createTime:string,
   completeTime?:string
}
export const useTodoStore = defineStore("todo",()=>{
   const todos=ref<TodoItem[]>([])
   const dids=ref<TodoItem[]>([])
   const undos=ref<TodoItem[]>([])

  /**应用了pinia-plugin-persistedstate持久化插件后， 不需要手动定义loadFromLocal和手动saveToLocal
   * 
    }*/ 

    
    //------以下是对待办中的操作--------
    //新增待办
    function addTodo(item:Omit<TodoItem,'id'|'createTime'>){
        //Omit 是 TypeScript 内置的类型操作符，用于从已有的类型中排除某些属性，得到一个新的类型。
        const newItem:TodoItem={
            id:Date.now(),
            ...item,
            createTime:useGetCurrentTime()
        }
        todos.value.push(newItem)
      //  saveToLocal()
    }
    //更新待办
    function updateTodo(updateItem:TodoItem){
       const index=todos.value.findIndex(i=>i.id===updateItem.id)
       if (index!==-1){
         todos.value[index]=updateItem
       //  saveToLocal()
       }
    }
    //删除待办
    function deleteTodo(id:number|string,silent=false){
        const index=todos.value.findIndex(i=>i.id===id)
        if(index!==-1){
            todos.value.splice(index,1)
         //   saveToLocal()
            if(!silent){
              ElMessage.success('删除成功！') 
            }

        }
    }
    
    
    //批量完成，适合待办到完成的操作
    function completeTodos(ids:(number|string)[]){
        const completeItems=todos.value.filter(item=>ids.includes(item.id))
        if (completeItems.length>0){
            const completeItemsWithTime=completeItems.map(item=>({
                ...item,
                completeTime:useGetCurrentTime()}))
           todos.value= todos.value.filter(item=>!ids.includes(item.id))
           dids.value.push(...completeItemsWithTime)
        }
    }
    //检查任务过期，将过期任务从待办中移到未完成
    function checkExpiredTasks(){
        const now=new Date().getTime()
        const expired=todos.value.filter(item=>{
            const timestamp = new Date(item.date.replace(' ', 'T')).getTime()
            return !isNaN(timestamp) && timestamp <= now
        })
        // 从待办中删除过期任务
        if(expired.length>0){
           todos.value = todos.value.filter(item => {
               const timestamp = new Date(item.date.replace(' ', 'T')).getTime()
               return isNaN(timestamp) || timestamp > now
           })
        }
        // 添加到未完成列表，去重（防止重复添加）
        const newExpired = expired.filter(e => !undos.value.some(u => u.id === e.id))
        if (newExpired.length) {
            undos.value.push(...newExpired)
        }
    }
    //-------以下是对未完成的操作--------
    //编辑后更新待办事项
    function updateUndo(updateItem:TodoItem){
        const index=undos.value.findIndex(i=>i.id===updateItem.id)
        if (index!==-1){
            undos.value[index]=updateItem
       //     saveToLocal()
        }
    }
    //删除待办
    function deleteUndo(id:number|string){
        const index =undos.value.findIndex(i=>i.id===id)
        if(index!==-1){
            undos.value.splice(index,1)
        //    saveToLocal()
        }
    }
    //从未完成移回待办
    function undoMoveTodo(item:TodoItem){
        const index=undos.value.findIndex(i=>i.id===item.id)
        if(index!==-1){
            undos.value.splice(index,1)
            const {completeTime,...todoItem}=item  
            //这是 JavaScript 的解构赋值与剩余运算符（rest）的组合语法：
            // 1、从 item 对象中取出 completedTime 属性（无论该属性是否存在）。
            // 2、将 item 对象中剩下的所有属性收集到一个新对象 todoItem 中。
            todos.value.push(todoItem)
         //   saveToLocal()

        }
    }
    //从未完成移到已完成
    function undoMoveDid(item:TodoItem){
        const index=undos.value.findIndex(i=>i.id===item.id)
        if(index!==-1){
            undos.value.splice(index,1)
            const completeItem={
                ...item,
                completeTime:useGetCurrentTime()
            }
            dids.value.push(completeItem)
        //    saveToLocal()
        }
    }
    //--------已完成的操作----------
    //删除已完成
    function deleteDid(id:number|string){
        const index =dids.value.findIndex(i=>i.id===id)
        if(index!==-1){
            dids.value.splice(index,1)
        //    saveToLocal()
        }
    }
    return{
        //state
        todos,
        undos,
        dids,
        //actions
        //loadFromLocal,
        addTodo,
        updateTodo,
        deleteTodo,
        completeTodos,
        checkExpiredTasks,
        updateUndo,
        deleteUndo,
        undoMoveTodo,
        undoMoveDid,
        deleteDid
    }
},{
        persist:{
            key:'todo-app',
            storage:localStorage,
            pick:["todos","dids","undos"]
        }
    }

)