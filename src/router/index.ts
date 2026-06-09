import {createRouter,createWebHistory} from "vue-router"
import type {RouteRecordRaw} from "vue-router"

const routes:RouteRecordRaw[]=[
    {
    path:"/login",
    name:"Login",
    component:()=>import("@/views/Login.vue")
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/Register.vue')
    },
    {
    path:"/",
    name:"Home",
    component:()=>import ("@/layouts/Layout.vue"),
    redirect:"/todo",
    children:[
        {
          path:"/todo",
          name:"Todo",
          component:()=>import ("@/views/Todo.vue")
        },
        {
          path:"/did",
          name:"Did",
          component:()=>import ("@/views/Did.vue")
        },
        {
          path:"/undo",
          name:"Undo",
          component:()=>import ("@/views/Undo.vue")
        }
    ]
    }  
]
const router=createRouter({
    history:createWebHistory(),
    routes
})

//路由守卫：检查登录状态  //Vue Router 的全局前置守卫，用于在路由跳转前进行权限控制
router.beforeEach((to, from) => {
    const token = localStorage.getItem('token');
    
    if (to.meta.requiresAuth && !token) {
        return '/login';
    }
    
    if ((to.path === '/login' || to.path === '/register') && token) {
        return '/';
    }
    
    return true;
});

export default router;
