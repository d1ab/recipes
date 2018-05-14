import _Vue from "vue";
import Axios from "axios";

export function AxiosPlugin(Vue: typeof _Vue, options?: any): void {
    Vue.prototype.$axiosHttp = Axios.create({
        baseURL: `http://localhost:3000/`,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
