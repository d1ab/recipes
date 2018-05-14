import { getStoreAccessors } from "vuex-typescript";
import _isEmpty from "lodash/isEmpty";
const INITIAL_STATE = {
    title: '',
    ingredients: '',
    submitEnabled: false
};
export const recipeForm = {
    namespaced: true,
    state: INITIAL_STATE,
    getters: {
        getFormParams: (state) => state,
        getRecipesCount: (state) => state.overviewItems.length,
        getDisableSubmit: (state) => state.submitEnabled,
    },
    mutations: {
        updateFormField(state, formHandler) {
            state[formHandler.field] = formHandler.value;
            if (!_isFormEmpty(state)) {
                state.submitEnabled = true;
                return;
            }
            state.submitEnabled = false;
        },
        resetState(state) {
            state = INITIAL_STATE;
        },
        disableSubmitButton(state) {
            state.submitEnabled = false;
        }
    },
    actions: {
        updateForm(context, payload) {
            commitUpdateForm(context, payload);
        },
        resetForm(context) {
            commitResetForm(context);
        },
        disableSubmitButton(context) {
            commitDisableSubmitButton(context);
        }
    }
};
function _isFormEmpty(state) {
    return [state.title, state.ingredients].some(stateProperty => {
        return _isEmpty(stateProperty);
    });
}
const { commit, read, dispatch } = getStoreAccessors("recipeForm");
const getters = recipeForm.getters;
export const getFormParams = read(getters.getFormParams);
export const getDisableSubmit = read(getters.getDisableSubmit);
const actions = recipeForm.actions;
export const dispatchUpdateForm = dispatch(actions.updateForm);
export const dispatchResetForm = dispatch(actions.resetForm);
export const dispatchDisableSubmitButton = dispatch(actions.disableSubmitButton);
const mutations = recipeForm.mutations;
export const commitUpdateForm = commit(mutations.updateFormField);
export const commitResetForm = commit(mutations.resetState);
export const commitDisableSubmitButton = commit(mutations.disableSubmitButton);
//# sourceMappingURL=recipe-form.module.js.map