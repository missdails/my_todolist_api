import {createRouter,createWebHistory} from "vue-router"
import type {RouteRecordRaw} from "vue-router"

const routes:RouteRecordRaw[]=[
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
export default router