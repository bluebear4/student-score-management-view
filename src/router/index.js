//导入模块
import Vue from 'vue';
import VueRouter from 'vue-router';
import UserLayout from "@/layouts/UserLayout";

//注册路由组件
Vue.use(VueRouter);

//编写路由规则
const routes = [
    {
        path: "/user",
        name: 'user',
        component: UserLayout,
        hidden: true,
        children: [
            {
                path: 'login',
                name: 'login',
                component: () => import('@/views/user/Login')
            },
            {
                path: 'register',
                name: 'register',
                component: () => import('@/views/user/Register')
            },
            // {
            //     path: 'register-result',
            //     name: 'registerResult',
            //     component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
            // },
            // {
            //     path: 'recover',
            //     name: 'recover',
            //     component: undefined
            // }
        ]
    }
]

//创建路由
const router = new VueRouter({
    mode: 'history',
    routes
})

//导出
export default router;