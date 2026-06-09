import request from "./request";
 
export interface RegisterData {
    username:string;
    password:string;
}

export interface LoginData{
    username:string;
    password:string;
}

// 后端通用返回格式
interface Result<T> {
  code: number
  message: string
  data: T
}

//注册
export const register =(data:RegisterData) =>request.post<Result<string>>('/auth/register',data);

//登录
export const login =(data:LoginData)=> request.post<Result<string>>('/auth/login',data);