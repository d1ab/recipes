import {ActionContext} from "vuex";
import {IAppState, INotification} from "@/types";
import {getStoreAccessors} from "vuex-typescript";

type NotificationContext = ActionContext<INotification[], IAppState>;

const INITIAL_STATE: INotification[] = [];

export const notifications = {
    namespaced: true,
    state: INITIAL_STATE,
    getters: {
        getNotifications: (state: INotification[]) => state
    },
    mutations: {
        setNotification(state: INotification[], notification: INotification) {
            state.push(notification)
        },

        clearNotification(state: INotification[]) {
            state = [];
        }
    },
    actions: {
        setNotification(context: NotificationContext, payload: INotification) {
            commitSetNotification(context, payload)
        },

        clearNotifications(context: NotificationContext) {
            commitClearNotifications(context);
        }
    }
};


const {commit, read, dispatch} = getStoreAccessors<INotification[], IAppState>("notifications");

const getters = notifications.getters;

export const getNotifications = read(getters.getNotifications);

const actions = notifications.actions;

export const dispatchSetNotification = dispatch(actions.setNotification);
export const dispatchClearNotifications = dispatch(actions.clearNotifications);

const mutations = notifications.mutations;

export const commitSetNotification = commit(mutations.setNotification);
export const commitClearNotifications = commit(mutations.clearNotification);
