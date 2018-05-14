import Axios from "axios";
export function AxiosPlugin(Vue, options) {
    Vue.prototype.$axiosHttp = Axios.create({
        baseURL: `http://localhost:3000/`,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
//# sourceMappingURL=http-common.js.map