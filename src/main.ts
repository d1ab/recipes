import Vue from "vue";
import App from "./App.vue";

import router from "./router";
import {store} from "./store/store.module";
import {AxiosPlugin} from './plugins/http-common';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false;

import VueRx from 'vue-rx'
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription' ;
import {Subject} from 'rxjs/Subject';

Vue.use(VueRx, {
    Observable,
    Subscription,
    Subject
});
Vue.use(AxiosPlugin);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
