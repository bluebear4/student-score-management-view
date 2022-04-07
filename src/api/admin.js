import request, {requestFailed} from "@/api/request";
import {NoAuth} from "@/api/student";

const adminApi = {
    getValidateCode: 'admin/getValidateCode',
    changeValidateCode: 'admin/changeValidateCode',

}


export function getValidateCode(parameter) {
    return request({
        url: adminApi.getValidateCode,
        method: 'get',
        params: parameter
    })
}

export function GetValidateCode(parameter, resolve, vue, reject = requestFailed) {
    return new Promise(() => {
        getValidateCode(parameter).then(response => {
            if (response.data.Code === 10004 || response.data.Code === 10005) {
                NoAuth(vue);
            }
            resolve(response)
        }).catch(error => {
            reject(vue, error)
        })
    })
}

export function changeValidateCode(parameter) {
    return request({
        url: adminApi.changeValidateCode,
        method: 'post',
        data: parameter
    })
}

export function ChangeValidateCode(parameter, resolve, vue, reject = requestFailed) {
    return new Promise(() => {
        changeValidateCode(parameter).then(response => {
            resolve(response)
            if (response.data.Code === 10004 || response.data.Code === 10005) {
                NoAuth(vue);
            }
        }).catch(error => {
            reject(vue, error)
        })
    })
}