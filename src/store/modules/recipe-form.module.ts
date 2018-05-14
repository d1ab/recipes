import {ActionContext} from "vuex";
import {IAppState, IPayloadFormHandler, IRecipeForm, IRecipeOverview} from "@/types";
import {getStoreAccessors} from "vuex-typescript";

import _isEmpty from "lodash/isEmpty";

type RecipesFormContext = ActionContext<IRecipeForm, IAppState>;

const INITIAL_STATE: IRecipeForm = {
    title: '',
    ingredients: '',
    submitEnabled: false
};

export const recipeForm = {
    namespaced: true,
    state: INITIAL_STATE,
    getters: {
        getFormParams: (state: IRecipeForm) => state,
        getRecipesCount: (state: IRecipeOverview) => state.overviewItems.length,
        getDisableSubmit: (state: IRecipeForm) => state.submitEnabled,
    },
    mutations: {
        updateFormField(state: IRecipeForm, formHandler: IPayloadFormHandler) {
            state[formHandler.field] = formHandler.value;

            if (!_isFormEmpty(state)) {
                state.submitEnabled = true;

                return;
            }

            state.submitEnabled = false;
        },

        resetState(state: IRecipeForm) {
            state = INITIAL_STATE;
        },

        disableSubmitButton(state: IRecipeForm) {
            state.submitEnabled = false;
        }
    },
    actions: {
        updateForm(context: RecipesFormContext, payload: IPayloadFormHandler) {
            commitUpdateForm(context, payload)
        },

        resetForm(context: RecipesFormContext) {
            commitResetForm(context);
        },

        disableSubmitButton(context: RecipesFormContext) {
            commitDisableSubmitButton(context);
        }
    }
};

function _isFormEmpty(state: IRecipeForm) {
    return [state.title, state.ingredients].some(stateProperty => {
        return _isEmpty(stateProperty);
    });
}


const {commit, read, dispatch} = getStoreAccessors<IRecipeForm, IAppState>("recipeForm");

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

