import request, {requestFailed} from '@/api/request'
import {NoAuth} from "@/api/student";


const teacherApi = {
    addInfo: 'teacher/addInfo',
    uploadInfo: 'teacher/upload/info',
    getInfos: 'teacher/getInfos',
    updateInfo: 'teacher/updateInfo',
    deleteInfo: 'teacher/deleteInfo',

    addScore: 'teacher/addScore',
    uploadScore: 'teacher/upload/score',
    getClasses: 'teacher/getClasses',
    getScoresByClass: 'teacher/getScoresByClass',
    updateScore: 'teacher/updateScore',
    deleteScore: 'teacher/deleteScore',

}

export function addInfo(parameter) {
    return request({
        url: teacherApi.addInfo,
        method: 'post',
        data: parameter
    })
}

export function AddInfo(parameter, resolve, vue, reject = requestFailed) {
    return new Promise(() => {
        addInfo(parameter).then(response => {
            resolve(response)
            if (response.data.Code === 10004 || response.data.Code === 10005) {
                NoAuth(vue);
            }
        }).catch(error => {
            reject(vue, error)
        })
    })
}

export function uploadInfo(parameter) {
    let params = new FormData()
    params.append('file', parameter)
    return request({
        url: teacherApi.uploadInfo,
        method: 'post',
        data: params,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': localStorage.getItem("authorization")
        }
    })
}

export function UploadInfo(parameter, resolve, vue, reject = requestFailed) {
    return new Promise(() => {
        uploadInfo(parameter).then(response => {
            resolve(response)
            if (response.data.Code === 10004 || response.data.Code === 10005) {
                NoAuth(vue);
            }
        }).catch(error => {
            reject(vue, error)
        })
    })
}


function getInfos() {
    return request({
        url: teacherApi.getInfos,
        method: 'get',
    })
}

export function GetInfos(resolve, vue, reject = requestFailed) {
    return new Promise(() => {
        getInfos().then(response => {
            resolve(response)
            if (response.data.Code === 10004 || response.data.Code === 10005) {
                NoAuth(vue);
            }
        }).catch(error => {
            reject(vue, error)
        })
    })
}

export function updateInfo(parameter) {
    return request({
        url: teacherApi.updateInfo,
        method: 'post',
        data: parameter
    })
}

export function UpdateInfo(parameter, resolve, vue, reject = requestFailed) {
    return new Promise(() => {
        updateInfo(parameter).then(response => {
            resolve(response)
            if (response.data.Code === 10004 || response.data.Code === 10005) {
                NoAuth(vue);
            }
        }).catch(error => {
            reject(vue, error)
        })
    })
}

export function deleteInfo(parameter) {
    return request({
        url: teacherApi.deleteInfo,
        method: 'post',
        data: parameter
    })
}

export function DeleteInfo(parameter, resolve, vue, reject = requestFailed) {
    return new Promise(() => {
        deleteInfo(parameter).then(response => {
            resolve(response)
            if (response.data.Code === 10004 || response.data.Code === 10005) {
                NoAuth(vue);
            }
        }).catch(error => {
            reject(vue, error)
        })
    })
}


export function addScore(parameter) {
    return request({
        url: teacherApi.addScore,
        method: 'post',
        data: parameter
    })
}

export function AddScore(parameter, resolve, vue, reject = requestFailed) {
    return new Promise(() => {
        addScore(parameter).then(response => {
            resolve(response)
            if (response.data.Code === 10004 || response.data.Code === 10005) {
                NoAuth(vue);
            }
        }).catch(error => {
            reject(vue, error)
        })
    })
}

export function uploadScore(parameter) {
    let params = new FormData()
    params.append('file', parameter)
    return request({
        url: teacherApi.uploadScore,
        method: 'post',
        data: params,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': localStorage.getItem("authorization")
        }
    })
}

export function UploadScore(parameter, resolve, vue, reject = requestFailed) {
    return new Promise(() => {
        uploadScore(parameter).then(response => {
            resolve(response)
            if (response.data.Code === 10004 || response.data.Code === 10005) {
                NoAuth(vue);
            }
        }).catch(error => {
            reject(vue, error)
        })
    })
}

export function getScoresByClass(parameter) {
    if (parameter.class === '') {
        return request({
            url: teacherApi.getScoresByClass,
            method: 'get',
        })
    } else {
        return request({
            url: teacherApi.getScoresByClass,
            method: 'get',
            params: parameter,
        })
    }

}

export function GetScoresByClass(parameter, resolve, vue, reject = requestFailed) {
    return new Promise(() => {
        getScoresByClass(parameter).then(response => {
            resolve(response)
            if (response.data.Code === 10004 || response.data.Code === 10005) {
                NoAuth(vue);
            }
        }).catch(error => {
            reject(vue, error)
        })
    })
}

function getClasses() {
    return request({
        url: teacherApi.getClasses,
        method: 'get',
    })
}

export function GetClasses(resolve, vue, reject = requestFailed) {
    return new Promise(() => {
        getClasses().then(response => {
            resolve(response)
            if (response.data.Code === 10004 || response.data.Code === 10005) {
                NoAuth(vue);
            }
        }).catch(error => {
            reject(vue, error)
        })
    })
}

export function updateScore(parameter) {
    return request({
        url: teacherApi.updateScore,
        method: 'post',
        data: parameter
    })
}

export function UpdateScore(parameter, resolve, vue, reject = requestFailed) {
    return new Promise(() => {
        updateScore(parameter).then(response => {
            resolve(response)
            if (response.data.Code === 10004 || response.data.Code === 10005) {
                NoAuth(vue);
            }
        }).catch(error => {
            reject(vue, error)
        })
    })
}

export function deleteScore(parameter) {
    return request({
        url: teacherApi.deleteScore,
        method: 'post',
        data: parameter
    })
}

export function DeleteScore(parameter, resolve, vue, reject = requestFailed) {
    return new Promise(() => {
        deleteScore(parameter).then(response => {
            resolve(response)
            if (response.data.Code === 10004 || response.data.Code === 10005) {
                NoAuth(vue);
            }
        }).catch(error => {
            reject(vue, error)
        })
    })
}