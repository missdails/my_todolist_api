import request, { type Result } from '@/api/request'

export interface Todo {
    id:number;
    userId:string;
    content:string;
    targetDate:string;
    status:number; // 0:待办, 1:已完成, 2:逾期
    completedTime?:string;
    createTime:string;
}

export interface ExpiredRes {
  expiredCount: number
}

//获取所有待办
export const getTodos =()=> request.get<Result<Todo[]>>('/todos');

//按状态获取待办
export const getTodosByStatus = (status:number) => request.get<Result<Todo[]>>(`/todos/status/${status}`);

//创建待办
export const createTodo = (data: {content: string;targetDate:string}) => request.post<Result<Todo>>(`/todos`,data);

//更新待办
export const updateTodo = (id:number,data:{content:string; targetDate:string})=> request.put<Result<null>>(`/todos/${id}`,data);

//删除待办
export const deleteTodo = (id:number) => request.delete<Result<null>>(`/todos/${id}`);

//完成待办
export const completeTodo = (id:number)=>request.patch<Result<null>>(`/todos/${id}/complete`);

//批量完成待办
export const batchCompleteTodos = (ids:number[])=>request.post<Result<null>>('/todos/batch-complete',ids);

//检查是否有逾期任务
export const expiredTodos=()=>request.post<Result<ExpiredRes>>('/todos/check-expired');