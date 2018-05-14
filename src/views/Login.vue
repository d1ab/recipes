<template>
    <b-container>
        <h1>Login page</h1>

        <b-form @submit="onLogin">
            <b-form-group label="User name">
                <b-form-input type="text"
                              v-model="userName"
                              required
                              placeholder="Enter user name">
                </b-form-input>
            </b-form-group>

            <b-form-group label="Password">
                <b-form-input type="password"
                              required
                              placeholder="Enter password">
                </b-form-input>
            </b-form-group>

            <b-button type="submit" variant="primary">Create</b-button>

        </b-form>
    </b-container>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {
        dispatchLogin,
        getUserSession
    } from "@/store/modules/session.module";
    import {
        dispatchClearNotifications,
        dispatchSetNotification
    } from "@/store/modules/notification.module";
    import {AlertType} from "@/types";

    @Component
    export default class Login extends Vue {
        // for simplicity used 2-way binding
        public userName = '';
        public password!: string;

        get isAuthenticated() {
            return getUserSession(this.$store);
        }

        onLogin(evt: Event) {
            evt.preventDefault();

            dispatchLogin(this.$store, {$http: this.$axiosHttp, payload: this.userName})
                .then(() => {
                    this.$router.push("add");

                    return dispatchSetNotification(this.$store, {
                        type: AlertType.SUCCESS,
                        message: 'User logged in successfully'
                    })
                })
                .catch(() => dispatchSetNotification(this.$store, {
                    type: AlertType.ERROR,
                    message: 'Failed to login. Try again with different user name'
                }))
                .finally(() => dispatchClearNotifications(this.$store))
        }


    }
</script>

