import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
axios.defaults.emulateJSON = true
// axios.defaults.withCredentials = true

axios.interceptors.request.use( //请求拦截
    async config => {
        // 开发时登录用的，可以直接替换小程序的 authorization
        const token = localStorage.getItem('token') || ''
        // config['headers']['token'] = process.env.NODE_ENV !== "production" && token
        if (token) {
            config['headers']['Authorization'] = 'Bearer ' + token    
        }
        config['headers']['Content-Type'] = "application/json;charset=utf-8"
        return config;
    },
    error => {
        return Promise.error(error);
    }
)

// 响应拦截器
axios.interceptors.response.use(response => {
    if (response.status === 200) return Promise.resolve(response); //进行中        
    else return Promise.reject(response); //失败       
}, error => { // 服务器状态码不是200的情况    
    if (error.response.status) {
        switch (error.response.status) {
            // 401: 未登录
            case 401:
                // goTologin()  // 跳转登录页面
                break
            default:
        }
        return Promise.reject(error.response);
    }
});

/** 
 * get方法，对应get请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
const get = (url, params) => {
    return new Promise((resolve, reject) => {
        axios.get(url, { params }).then(res => resolve(res.data)).catch(err => reject(err.data))
    });
}
/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
const post = (url, params) => {
    return new Promise((resolve, reject) => {
        //是将对象 序列化成URL的形式，以&进行拼接   
        // axios.post(url, QS.stringify(params)).then(res => {
        axios.post(url, params).then(res => {
            let data = res.data
            // if (data.code == 401 && !process.server) goLogin()
            resolve(data)
        }).catch(err => {
            if (err.data.code == 401) {
                // goLogin()
                resolve(err.data);
            } else reject(err.data)
        })
    });
}

// 打开登录
const goLogin = () => {
    if (typeof ajax_login === "function") ajax_login()
}

export default {
    get,
    post,
}
