import request, {requestFailed} from '@/api/request'
import Cookie from "js-cookie";

const studentApi = {
    Logout: 'student/logout',
    ChangePassword: 'student/changePassword',
    GetRoleID: 'student/getRoleID',
    GetScores: 'student/getScores',
}


function logout() {
    return request({
        url: studentApi.Logout,
        method: 'post',
    })
}

export function Logout(resolve, vue, reject = requestFailed) {
    return new Promise(() => {
        logout().then(response => {
            if (response.data.Code === 10004 || response.data.Code === 10005) {
                NoAuth(vue);
            } else {
                resolve(response)
            }
        }).catch(error => {
            reject(vue, error)
        })
    })
}


function changePassword(params) {
    return request({
        url: studentApi.ChangePassword,
        method: 'post',
        data: params,
    })
}

export function ChangePassword(params, resolve, vue, reject = requestFailed) {
    return new Promise(() => {
        changePassword(params).then(response => {
            if (response.data.Code === 10004 || response.data.Code === 10005) {
                NoAuth(vue);
            } else {
                resolve(response)
            }
        }).catch(error => {
            reject(vue, error)
        })
    })
}

function getScores() {
    return request({
        url: studentApi.GetScores,
        method: 'get',
    })
}

export function GetScores(resolve, vue, reject = requestFailed) {
    return new Promise(() => {
        getScores().then(response => {
            if (response.data.Code === 10004 || response.data.Code === 10005) {
                NoAuth(vue);
            } else {
                resolve(response)
            }
        }).catch(error => {
            reject(vue, error)
        })
    })
}

export function NoAuth(vue) {
    logout().then(() => {
        Cookie.remove('Auth')
        Cookie.remove('role')
        vue.$router.push('/')
        setTimeout(() => vue.$message.error('无权限或登录已过期'), 1000)
    }).catch(requestFailed)
}