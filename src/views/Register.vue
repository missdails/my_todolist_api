<template>
    <div class="register-container">
        <el-card class="register-card">
            <template #header>
                <h2>用户注册</h2>
            </template>
            
            <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" placeholder="2-10个字符" />
                </el-form-item>
                
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" type="password" placeholder="3-20个字符" show-password />
                </el-form-item>
                
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" show-password />
                </el-form-item>
                
                <el-form-item>
                    <el-button type="primary" @click="handleRegister" :loading="loading">注册</el-button>
                    <el-button @click="goToLogin">返回登录</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, type FormInstance } from 'element-plus';
import { register } from '@/api/auth';

const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);

const form = reactive({
    username: '',
    password: '',
    confirmPassword: ''
});

const validateConfirm = (rule: any, value: string, callback: any) => {
    if (value !== form.password) {
        callback(new Error('两次输入的密码不一致'));
    } else {
        callback();
    }
};

const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 2, max: 10, message: '用户名长度2-10个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 3, max: 20, message: '密码长度3-20个字符', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        { validator: validateConfirm, trigger: 'blur' }
    ]
};

const handleRegister = async () => {
    if (!formRef.value) return;
    
    await formRef.value.validate();
    loading.value = true;
    
    try {
        await register({ username: form.username, password: form.password });
        ElMessage.success('注册成功，请登录');
        router.push('/login');
    } catch (error) {
        console.error('注册失败', error);
    } finally {
        loading.value = false;
    }
};

const goToLogin = () => {
    router.push('/login');
};
</script>

<style scoped>
.register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.register-card {
    width: 450px;
}
</style>