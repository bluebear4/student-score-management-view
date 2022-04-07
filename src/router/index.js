//导入模块
import Vue from 'vue';
import VueRouter from 'vue-router';
import UserLayout from "@/layouts/UserLayout";
import Student from "@/layouts/StudentDashboard";
import Teacher from "@/layouts/TeacherDashboard";
import Cookie from "js-cookie"
import {NoAuth} from "@/api/student";
import Admin from "@/layouts/AdminDashboard";

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
        redirect: {name: 'teacher-info'},
        children: [
            {
                path: 'info',
                name: 'teacher-info',
                component: () => import ('@/views/teacher/Info')
            },
            {
                path: 'getScores',
                name: 'teacher-getScores',
                component: () => import ('@/views/teacher/Score')
            },
        ]
    },
    {
        path: '/admin',
        name: 'admin',
        component: Admin,
        redirect: {name: 'admin-info'},
        children: [
            {
                path: 'info',
                name: 'admin-info',
                component: () => import ('@/views/admin/Info')
            },
            {
                path: 'getScores',
                name: 'admin-getScores',
                component: () => import ('@/views/admin/Score')
            },
            {
                path: 'validateCode',
                name: 'admin-validateCode',
                component: () => import ('@/views/admin/ValidateCode')
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
            case '1':
                next({name: 'admin'});
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