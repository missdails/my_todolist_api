import { ElMessage } from "element-plus"
import {defineStore} from "pinia"
import {ref} from 'vue'
import { 
    getTodos,
    getTodosByStatus,
    createTodo,
    updateTodo,
    deleteTodo,
    completeTodo,
    batchCompleteTodos,
    expiredTodos
 } from "@/api/todo"
 import type {Todo} from "@/api/todo"

export const useTodoStore = defineStore("todo",()=>{
    //===========State===========
   const todos=ref<Todo[]>([])
   const dids=ref<Todo[]>([])
   const undos=ref<Todo[]>([])
   const loading=ref(false)
    //============辅助函数============
    //从后端加载所有数据并分类
    const loadAllData = async ()=>{
        loading.value=true
        try{
            const res = await getTodos()
            if (res.code===200){
                const allTodos=res.data
                //根据status分类
                todos.value=allTodos.filter((t:Todo)=>t.status===0)
                dids.value=allTodos.filter((t:Todo)=>t.status===1)
                undos.value=allTodos.filter((t:Todo)=>t.status===2)
            }
        }catch (e){
            console.error('加载数据失败',e)
            ElMessage.error('加载数据失败')
        }finally {
            loading.value=false
        }
    }
    //只加载待办中列表（status=0）
    const loadTodos = async()=>{
        loading.value=true
        try {
            const res=await getTodosByStatus(0)
            if(res.code===200){
                todos.value=res.data
            }
        }catch(e){
            console.error('加载待办失败',e)
        }finally{
            loading.value=false
        }
    }
    //只加载已完成列表（status=1）
    const loadDids= async()=>{
        loading.value=true
        try{
            const res=await getTodosByStatus(1)
            if(res.code===200){
                dids.value=res.data
            }
        }catch(e){
            console.error('加载已完成失败',e)
        }finally{
            loading.value=false
        }
    }
    //只加载未完成列表（status=2）
    const loadUndos= async()=>{
        loading.value=true
        try{
            const res=await getTodosByStatus(2)
            if(res.code===200){
                undos.value=res.data
            }
        }catch(e){
            console.error('加载未完成失败',e)
        }finally{
            loading.value=false
        }
    }
    //===========待办操作============
    //新增待办
    const addTodo =async (item:{content:string,date:string})=>{
        try{
            const res = await createTodo({
                content:item.content,
                targetDate:item.date
            })
            if(res.code===200){
                ElMessage.success('添加成功')
                //重新加载待办列表
                await loadTodos()
            }
        }catch(e){
            console.error('添加失败',e)
            throw e
        }
    }
    //更新待办
    const updateTodoItem =async(updatedItem:Todo)=>{
        try{
            const res=await updateTodo(updatedItem.id,{
                content:updatedItem.content,
                targetDate:updatedItem.targetDate
            })
            if(res.code===200){
                ElMessage.success('编辑成功')
                //重新加载相关列表
                await loadAllData()
            }
        }catch(e){
            console.error('编辑失败', e)
            throw e
        }
    }
    //删除待办
    const deleteTodoItem =async(id:number,silent:boolean=false)=>{
        try{
            const res=await deleteTodo(id)
            if(res.code===200){
                if(!silent){
                    ElMessage.success('删除成功')
                }
                //从本地列表中移除
                const index:number=todos.value.findIndex(t=>t.id===id)
                if(index!==-1){
                    todos.value.splice(index,1)
                }
            }
        }catch(e){
            console.error('删除失败', e)
            if (!silent) {
                ElMessage.error('删除失败')
            }
            throw e
        }
    }
    //完成单个待办
    const completeTodoItem = async (id: number) => {
        try {
            const res = await completeTodo(id)
            if (res.code === 200) {
                ElMessage.success('已完成')
                // 重新加载所有列表（因为状态改变了）
                await loadAllData()
            }
        } catch (error) {
            console.error('完成失败', error)
            throw error
        }
    }
    //批量完成待办
    const completeTodoItems=async(ids:(number|string)[])=>{
        const numberIds=ids.map(id=>typeof id==='string'?parseInt(id):id)
        try{
           const res=await batchCompleteTodos(numberIds)
           if(res.code===200){
                ElMessage.success(`已完成${ids.length}项任务`)
                // 重新加载所有列表
                await loadAllData()
           }
        }catch(e) {
            console.error('批量完成失败', e)
            throw e
        }
    }
    //检查过期任务
    const expiredHasTodos=async()=>{
        try{
            const res=await expiredTodos()
            if(res.data.expiredCount!==0){
                loading.value=true;
                console.log(`发现 ${res.data.expiredCount} 个逾期任务，正在刷新数据...`)
                    // 有逾期任务，重新加载所有数据
                    await loadAllData()
            }
        }catch (error) {
            console.error('检查逾期任务失败', error)
        }finally{
            loading.value=false
        }
    }

    // ==================== 未完成操作 (Undo) ====================
    
    // 从未完成移到待办（编辑后日期 > 当前时间）
    const undoMoveTodo = async (item: Todo) => {
        try {
            // 更新待办内容，后端会自动判断状态
            const res = await updateTodo(item.id, {
                content: item.content,
                targetDate: item.targetDate
            })
            if (res.code === 200) {
                ElMessage.success('已移回待办列表')
                await loadAllData()
            }
        } catch (error) {
            console.error('移回待办失败', error)
            throw error
        }
    }

    // 从未完成移到已完成
    const undoMoveDid = async (item: Todo) => {
        try {
            const res = await completeTodo(item.id)
            if (res.code === 200) {
                ElMessage.success('已完成')
                await loadAllData()
            }
        } catch (error) {
            console.error('完成失败', error)
            throw error
        }
    }

    // 更新未完成列表中的待办
    const updateUndoItem = async (updatedItem: Todo) => {
        try {
            const res = await updateTodo(updatedItem.id, {
                content: updatedItem.content,
                targetDate: updatedItem.targetDate
            })
            if (res.code === 200) {
                ElMessage.success('修改成功')
                await loadAllData()
            }
        } catch (error) {
            console.error('修改失败', error)
            throw error
        }
    }

    // 删除未完成列表中的待办
    const deleteUndoItem = async (id: number | string) => {
        const numericId = typeof id === 'string' ? parseInt(id) : id
        try {
            const res = await deleteTodo(numericId)
            if (res.code === 200) {
                ElMessage.success('删除成功')
                // 从未完成列表中移除
                const index = undos.value.findIndex(u => u.id === numericId)
                if (index !== -1) {
                    undos.value.splice(index, 1)
                }
            }
        } catch (error) {
            console.error('删除失败', error)
            throw error
        }
    }

    // ==================== 已完成操作 (Did) ====================
    
    // 删除已完成列表中的待办
    const deleteDidItem = async (id: number | string) => {
        const numericId = typeof id === 'string' ? parseInt(id) : id
        try {
            const res = await deleteTodo(numericId)
            if (res.code === 200) {
                ElMessage.success('删除成功')
                // 从已完成列表中移除
                const index = dids.value.findIndex(d => d.id === numericId)
                if (index !== -1) {
                    dids.value.splice(index, 1)
                }
            }
        } catch (error) {
            console.error('删除失败', error)
            throw error
        }
    }
    return{
        //-----state------
        todos,
        undos,
        dids,
        loading,
        //------方法-------
        expiredHasTodos,
        loadTodos,
        loadDids,
        loadUndos,
        loadAllData,
        addTodo,
        updateTodoItem,
        deleteTodoItem,
        completeTodoItem,
        completeTodoItems,
        undoMoveTodo,
        undoMoveDid,
        updateUndoItem,
        deleteUndoItem,
        deleteDidItem
    }

}
)