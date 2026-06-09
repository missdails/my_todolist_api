<template>
   <div class="login-container">
      <el-card class="login-card">
        <template #header>
            <h2>待办事项应用</h2>
        </template>

        <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
           <el-form-item label="用户名" prop="username" >
            <el-input v-model="form.username" placeholder="请输入用户名" />
           </el-form-item>

           <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入密码" />
           </el-form-item>

           <el-form-item>
            <el-button type="primary" @click="handleLogin" :loading="loading">登录</el-button>
            <el-button  @click="goToRegister">注册</el-button>
           </el-form-item>
        </el-form>
      </el-card>
   </div>
</template>

<script setup lang="ts">
   import { ref,reactive } from 'vue';
   import { ElMessage, type FormInstance } from 'element-plus';
   import {login} from '@/api/auth'
   import { useRouter } from 'vue-router';
   
   const router =useRouter();
   const formRef =ref<FormInstance>();
   const form=reactive({
      username:'',
      password:''
   });
   const rules={
     username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 2, max: 10, message: '用户名长度2-10个字符', trigger: 'blur' }
    ],
     password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 3, max: 20, message: '密码长度3-20个字符', trigger: 'blur' }
    ]
   };
   const loading=ref(false);
   const handleLogin=async()=>{
    if (!formRef.value) return;
    await formRef.value.validate();
    loading.value=true;
    try{
        const res =await login(form);
        if (res.code===200){
            localStorage.setItem('token',res.data);
            ElMessage.success('登录成功');
            router.push('/')
        } else {
      // 处理非200状态码
      ElMessage.error(res.message || '登录失败');
    }
  } catch (error: any) {
    // 处理请求异常
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message);
    } else if (error.message) {
      ElMessage.error(error.message);
    } else {
      ElMessage.error('登录失败，请稍后重试');
    }
    }finally {
        loading.value=false;
    }
   };
   const goToRegister=()=>{ 
     router.push('/register');
   };

</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.login-card {
    width: 400px;
}
</style>