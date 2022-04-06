//导入模块
import Vue from 'vue';
import VueRouter from 'vue-router';
import UserLayout from "@/layouts/UserLayout";
import Student from "@/layouts/StudentDashboard";
import Teacher from "@/layouts/TeacherDashboard";
import Cookie from "js-cookie"
import {NoAuth} from "@/api/student";

//注册路由组件
Vue.use(VueRouter);

//编写路由规则
const routes = [
    {
        path: '/',
        redirect: {name: 'login'}
    },
    {
        path: "/user",
        name: 'user',
        component: UserLayout,
        // hidden: true,
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
        ]
    },
    {
        path: '/student',
        name: 'student',
        component: Student,
        redirect: {name: 'getMyScores'},
        children: [
            {
                path: 'getMyScores',
                name: 'getMyScores',
                component: () => import('@/views/student/Score')
            },
        ]
    },
    {
        path: '/teacher',
        name: 'teacher',
        component: Teacher,
        redirect: {name: 'info'},
        children: [
            {
                path: 'info',
                name: 'info',
                component: () => import ('@/views/teacher/Info')
            },
            {
                path: 'getScores',
                name: 'getScores',
                component: () => import ('@/views/teacher/Score')
            },
        ]
    }
]

//创建路由
const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeEach((to, from, next) => {
    if (to.name === 'login' && Cookie.get('Auth') !== undefined) {
        if (Cookie.get('role') === undefined) {
            NoAuth()
            return
        }
        switch (Cookie.get('role')) {
            case '3':
                next({name: 'student'});
                break;
            case '2':
                next({name: 'teacher'});
                break;
            default:
                NoAuth()
                return
        }
    } else {
        next()
    }
})

//导出
export default router;