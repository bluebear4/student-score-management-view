import request, {requestFailed} from '@/api/request'
import Cookie from "js-cookie";
import {NoAuth} from "@/api/student";

const userApi = {
    Register: 'user/register',
    Login: 'user/login',

}

function register(parameter) {
    return request({
        url: userApi.Register,
        method: 'post',
        data: parameter
    })
}

export function Register(parameter, resolve, reject = requestFailed) {
    return new Promise(() => {
        register(parameter).then(response => {
            resolve(response)
            if (response.data.Code === 10004 || response.data.Code === 10005) {
                NoAuth();
            }
        }).catch(error => {
            reject(error)
        })
    })
}

function login(parameter) {
    return request({
        url: userApi.Login,
        method: 'post',
        data: parameter
    })
}

export function Login(parameter, resolve, reject = requestFailed) {
    return new Promise(() => {
        login(parameter).then(response => {
            resolve(response)
            if (response.data.Code === 10004 || response.data.Code === 10005) {
                NoAuth();
            }
        }).catch(error => {
            reject(error)
        })
    })
}
