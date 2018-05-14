import _Vue, {ComponentOptions} from 'vue';
import {AxiosStatic} from "axios";

declare module "vue/types/options" {
    interface ComponentOptions<V extends _Vue> {
        axiosHttp?: AxiosStatic;
    }
}

declare module 'vue/types/vue' {
    interface Vue {
        $axiosHttp: AxiosStatic;
    }
}