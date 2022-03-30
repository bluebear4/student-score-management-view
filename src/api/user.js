import request from '@/api/request'

const userApi = {
    Register: 'user/register',
    Login: '/user/login',
    Logout: '/user/logout',
}

export function register (parameter) {
    return request({
        url: userApi.Register,
        method: 'post',
        data: parameter
    })
}

export function login (parameter) {
    return request({
        url: userApi.Login,
        method: 'post',
        data: parameter
    })
}


export function logout () {
    return request({
        url: userApi.Logout,
        method: 'post',
    })
}

