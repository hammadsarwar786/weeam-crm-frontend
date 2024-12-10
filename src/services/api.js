import axios from "axios"
import { constant } from "constant"


export const postApi = async (path, data, login, server="baseUrl") => {
    try {
        let result = await axios.post(constant[server] + path, data, {
            headers: server === "server2" ? {} : {
                Authorization:  (localStorage.getItem("token") || sessionStorage.getItem("token"))
            }
        })
        if (result.data?.token && result.data?.token !== null) {
            if (login) {
                localStorage.setItem('token', result.data?.token)
            } else {
                sessionStorage.setItem('token', result.data?.token)
            }
            localStorage.setItem('user', JSON.stringify(result.data?.user))
        }
        return result
    } catch (e) {
        console.error(e)
        return e
    }
}
export const putApi = async (path, data, server = "baseUrl") => {
    try {
        let result = await axios.put(constant[server] + path, data, {
            headers: server === "server2" ? {} : {
                Authorization:  (localStorage.getItem("token") || sessionStorage.getItem("token"))
            }
        })
        return result
    } catch (e) {
        console.error(e)
        return e
    }
}

export const deleteApi = async (path, id, server="baseUrl") => {
    try {
        let result = await axios.delete(constant[server] + path + id, {
            headers: {
                Authorization: localStorage.getItem("token") || sessionStorage.getItem("token")
            }
        })
        if (result.data?.token && result.data?.token !== null) {
            localStorage.setItem('token', result.data?.token)
        }
        return result
    } catch (e) {
        console.error(e)
        return e
    }
}

export const deleteManyApi = async (path, data, server="baseUrl") => {
    try {
        let result = await axios.post(constant[server] + path, data, {
            headers: {
                Authorization: localStorage.getItem("token") || sessionStorage.getItem("token")
            }
        })
        if (result.data?.token && result.data?.token !== null) {
            localStorage.setItem('token', result.data?.token)
        }
        return result
    } catch (e) {
        console.error(e)
        return e
    }
}

export const getApi = async (path, id, server="baseUrl") => {
    try {
        if (id) {
            let result = await axios.get(constant[server] + path + id, {
                headers: {
                    Authorization: localStorage.getItem("token") || sessionStorage.getItem("token")
                }
            })
            return result
        }
        else {
            let result = await axios.get(constant[server] + path, {
                headers: {
                    Authorization: localStorage.getItem("token") || sessionStorage.getItem("token")
                }
            })
            return result
        }
    } catch (e) {
        console.error(e)
        return e
    }
}

