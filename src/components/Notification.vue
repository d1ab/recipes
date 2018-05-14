<template>
    <div>
        <b-alert v-for="(notification, index) of notifications" :key="index"
                 :show="5"
                 dismissible
                 v-bind:variant="notification.type">
            {{notification.message}}
        </b-alert>
    </div>
</template>

<script lang="ts">
    import {Vue} from "vue-property-decorator";
    import Component from "vue-class-component";
    import {
        getNotifications
    } from "@/store/modules/notification.module";
    import {INotification} from "../types";


    @Component
    export default class Notification extends Vue {

        get notifications(): INotification[] {
            return getNotifications(this.$store);
        }
    }
</script>
