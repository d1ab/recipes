import { getStoreAccessors } from "vuex-typescript";
const INITIAL_STATE = [];
export const notifications = {
    namespaced: true,
    state: INITIAL_STATE,
    getters: {
        getNotifications: (state) => state
    },
    mutations: {
        setNotification(state, notification) {
            state.push(notification);
        },
        clearNotification(state) {
            state = [];
        }
    },
    actions: {
        setNotification(context, payload) {
            commitSetNotification(context, payload);
        },
        clearNotifications(context) {
            commitClearNotifications(context);
        }
    }
};
const { commit, read, dispatch } = getStoreAccessors("notifications");
const getters = notifications.getters;
export const getNotifications = read(getters.getNotifications);
const actions = notifications.actions;
export const dispatchSetNotification = dispatch(actions.setNotification);
export const dispatchClearNotifications = dispatch(actions.clearNotifications);
const mutations = notifications.mutations;
export const commitSetNotification = commit(mutations.setNotification);
export const commitClearNotifications = commit(mutations.clearNotification);
//# sourceMappingURL=notification.module.js.map