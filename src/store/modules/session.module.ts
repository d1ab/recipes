import {ActionContext} from "vuex";
import {IAppState, IRecipesPayload, IUserSession} from "@/types";
import {getStoreAccessors} from "vuex-typescript";

import _isNull from "lodash/isNull";
import {SessionApi} from "@/api/session-api";

type UserSessionContext = ActionContext<IUserSession, IAppState>;

const LOCAL_STORAGE_SESSION_KEY = "session";
const INITIAL_STATE: IUserSession = {
    isAuthenticated: false,
    userName: ''
};

export const userSession = {
    namespaced: true,
    state: INITIAL_STATE,
    getters: {
        isAuthenticated: (state: IUserSession): boolean => {
            if (!state.isAuthenticated) {
                const storedSession = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);

                return storedSession ? !state.isAuthenticated : state.isAuthenticated;
            }

            return state.isAuthenticated;
        }
    },
    mutations: {
        setUserSession(state: IUserSession, userName: string) {
            state.isAuthenticated = true;
            state.userName = userName;
        },

        removeUserSession(state: IUserSession) {
            state.isAuthenticated = false;
            state.userName = '';
        }
    },
    actions: {
        async login(context: UserSessionContext, payloadWrapper: IRecipesPayload<string>) {
            const [session] = await SessionApi.getUserSession(payloadWrapper.$http, payloadWrapper.payload);

            if (_isNull(session)) {
                return Promise.reject(null);
            }

            localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, session.userName);
            commitSetUserSession(context, session.userName);

            return Promise.resolve();
        },

        logout(context: UserSessionContext) {
            localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
            commitRemoveUserSession(context)
        },

        setUserSession(context: UserSessionContext) {
            const user = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);

            if (user) {
                commitSetUserSession(context, user)
            }
        }

    }
};


const {commit, read, dispatch} = getStoreAccessors<IUserSession, IAppState>("userSession");

const getters = userSession.getters;

export const getUserSession = read(getters.isAuthenticated);

const actions = userSession.actions;

export const dispatchLogin = dispatch(actions.login);
export const dispatchLogout = dispatch(actions.logout);
export const dispatchSetUserSession = dispatch(actions.setUserSession);

const mutations = userSession.mutations;

export const commitSetUserSession = commit(mutations.setUserSession);
export const commitRemoveUserSession = commit(mutations.removeUserSession);
