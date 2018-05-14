import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger';
import {recipesOverview} from './modules/overview.module';
import {recipeForm} from './modules/recipe-form.module';
import {userSession} from "@/store/modules/session.module";
import {notifications} from "@/store/modules/notification.module";
import {IAppState} from "@/types";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export const store = new Vuex.Store<IAppState>({
    modules: {
        recipesOverview,
        recipeForm,
        userSession,
        notifications
    },
    strict: debug,
    plugins: debug ? [createLogger({})] : []
});