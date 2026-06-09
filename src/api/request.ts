import axios from 'axios';
import { ElMessage} from 'element-plus';

//创建axios实例
const request = axios.create({  
    baseURL:'http://localhost:8080/api',  //所要请求的后端路径，公共的地址前缀，避免重复写
    timeout:10000  
});

// ==========新增：全局重定义axios返回类型==========
// 扩展axios类型，改写get/post返回值
declare module 'axios' {
  interface AxiosInstance {
    get<T>(url: string, params?: any): Promise<T>
    post<T>(url: string, data?: any): Promise<T>
    put<T>(url: string, data?: any): Promise<T>
    delete<T>(url: string, data?: any): Promise<T>
    patch<T>(url: string, data?: any): Promise<T>
  }
}

// 统一后端返回格式
export interface Result<T> {
  code: number
  message: string
  data: T
}

//请求拦截器：自动添加token  //即请求前的处理
 request.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token'); //从本地获取token
        if(token){
            config.headers.Authorization = `Bearer ${token}`;  //将token以`Bearer ${token}`格式 写到配置信息的headers.Authorization中
        }
        return config;
    },
    error => Promise.reject(error)  // 请求错误处理
 );

 //响应拦截器：统一处理错误  //响应后的处理
request.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        if(error.response?.status ===401){
            ElMessage.error('请先登录');
            localStorage.removeItem('token');
            window.location.href = '/login';
        }else {
            ElMessage.error(error.response?.data?.message || '请求失败');
        }
        return Promise.reject(error);
    }
);

export default request;