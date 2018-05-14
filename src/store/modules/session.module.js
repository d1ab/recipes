import { getStoreAccessors } from "vuex-typescript";
import _isNull from "lodash/isNull";
import { SessionApi } from "@/api/session-api";
const LOCAL_STORAGE_SESSION_KEY = "session";
const INITIAL_STATE = {
    isAuthenticated: false,
    userName: ''
};
export const userSession = {
    namespaced: true,
    state: INITIAL_STATE,
    getters: {
        isAuthenticated: (state) => {
            if (!state.isAuthenticated) {
                const storedSession = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
                return storedSession ? !state.isAuthenticated : state.isAuthenticated;
            }
            return state.isAuthenticated;
        }
    },
    mutations: {
        setUserSession(state, userName) {
            state.isAuthenticated = true;
            state.userName = userName;
        },
        removeUserSession(state) {
            state.isAuthenticated = false;
            state.userName = '';
        }
    },
    actions: {
        async login(context, payloadWrapper) {
            const [session] = await SessionApi.getUserSession(payloadWrapper.$http, payloadWrapper.payload);
            if (_isNull(session)) {
                return Promise.reject(null);
            }
            localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, session.userName);
            commitSetUserSession(context, session.userName);
            return Promise.resolve();
        },
        logout(context) {
            localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
            commitRemoveUserSession(context);
        },
        setUserSession(context) {
            const user = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
            if (user) {
                commitSetUserSession(context, user);
            }
        }
    }
};
const { commit, read, dispatch } = getStoreAccessors("userSession");
const getters = userSession.getters;
export const getUserSession = read(getters.isAuthenticated);
const actions = userSession.actions;
export const dispatchLogin = dispatch(actions.login);
export const dispatchLogout = dispatch(actions.logout);
export const dispatchSetUserSession = dispatch(actions.setUserSession);
const mutations = userSession.mutations;
export const commitSetUserSession = commit(mutations.setUserSession);
export const commitRemoveUserSession = commit(mutations.removeUserSession);
//# sourceMappingURL=session.module.js.map