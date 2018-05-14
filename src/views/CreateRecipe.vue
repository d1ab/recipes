<template>
    <b-container v-authorized-user>
        <h1>Create new recipe</h1>

        <b-form @submit="onSubmit">
            <b-form-group label="Recipe title">
                <b-form-input type="text"
                              v-bind:disabled="submitted"
                              v-stream:input="{
                                subject: title$,
                                data: 'title'
                              }"
                              required
                              placeholder="Enter recipe title">
                </b-form-input>
            </b-form-group>
            <b-form-group label="Recipe ingredients">
                <b-form-input type="text"
                              v-bind:disabled="submitted"
                              v-stream:input="{
                                subject: ingredients$,
                                data: 'ingredients'
                              }"
                              required
                              placeholder="Enter name">
                </b-form-input>
            </b-form-group>

            <b-button type="submit" variant="primary" v-bind:disabled="submitEnabled">Create</b-button>
        </b-form>
    </b-container>
</template>

<script lang="ts">
    import {Subject} from 'rxjs/Subject';
    import {Observable} from 'rxjs/Observable';
    import {Vue} from "vue-property-decorator";
    import Component from "vue-class-component";
    import {
        dispatchDisableSubmitButton,
        dispatchResetForm,
        dispatchUpdateForm,
        getDisableSubmit,
        getFormParams
    } from "@/store/modules/recipe-form.module";
    import {getUserSession} from "@/store/modules/session.module";
    import {dispatchCreateRecipe} from "@/store/modules/overview.module"
    import {
        dispatchClearNotifications,
        dispatchSetNotification
    } from "@/store/modules/notification.module";
    import {AlertType, IPayloadFormHandler} from "@/types";

    import 'rxjs/add/operator/map';
    import 'rxjs/add/operator/do';
    import 'rxjs/add/operator/filter';
    import 'rxjs/add/operator/debounceTime';
    import 'rxjs/add/operator/share';
    import 'rxjs/add/observable/from';

    @Component({
        domStreams: ['ingredients$', 'title$'],
        directives: {
            authorizedUser: {
                bind: (element: any, binding: any, vnode: any) => {
                    const $store = vnode.context.$store;
                    const $router = vnode.context.$router;

                    const isAuthenticatedUser = getUserSession($store);

                    if (!isAuthenticatedUser) {
                        $router.push("login")
                    }
                }
            }
        }
    })
    export default class CreateRecipe extends Vue {
        public submitted = false;
        public FORM_DEBOUNCE_TIME = 500;

        public title$ = new Subject();
        public ingredients$ = new Subject();

        mounted() {
            this.$subscribeTo(this._remapFields(this.title$), res => dispatchUpdateForm(this.$store, res));
            this.$subscribeTo(this._remapFields(this.ingredients$), res => dispatchUpdateForm(this.$store, res));
        }

        get submitEnabled() {
            return !getDisableSubmit(this.$store);
        }


        onSubmit(evt: any) {
            evt.preventDefault();

            const formParams = getFormParams(this.$store);

            dispatchCreateRecipe(this.$store, {$http: this.$axiosHttp, payload: formParams})
                .then(() => dispatchDisableSubmitButton(this.$store))
                .then(() => {
                    dispatchSetNotification(this.$store, {
                        type: AlertType.SUCCESS,
                        message: `Recipe "${formParams.title} created successfully!`
                    });
                    dispatchResetForm(this.$store);

                    this.submitted = true;

                    this.$router.push("/")
                })
                .catch(() => dispatchSetNotification(this.$store, {
                    type: AlertType.ERROR,
                    message: `Error occurred while creating new recipe!`
                }))
                .finally(() => dispatchClearNotifications(this.$store))
        }

        public _remapFields(field: Subject<{}>): Observable<IPayloadFormHandler> {
            return field
                .debounceTime(this.FORM_DEBOUNCE_TIME)
                .map((result: any) => ({field: result.data, value: result.event.msg}))
        }

    }
</script>

<style scoped>
    legend {
        float: left;
        display: inline-block;
    }

</style>
