<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Recipes</router-link> |
      <router-link to="/favs">Favorites</router-link> |
      <router-link to="/add">Add new</router-link> {{isAuthenticated ? "|" : ""}}
      <a v-if="isAuthenticated" @click="logout()">Logout</a>
    </div>
    <div class="logo">
      <Notification/>
      <img src="./assets/logo.png">
    </div>
    <router-view/>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {
        dispatchLogout,
        dispatchSetUserSession,
        getUserSession
    } from "./store/modules/session.module";
    import Notification from "./components/Notification.vue";
    import {
        dispatchClearNotifications,
        dispatchSetNotification
    } from "./store/modules/notification.module";
    import {AlertType} from "./types";

    @Component({
        components: {Notification}
    })
    export default class App extends Vue {

        mounted() {
            dispatchSetUserSession(this.$store);
        }

        get isAuthenticated(): boolean {
            return getUserSession(this.$store);
        }

        logout() {
            dispatchLogout(this.$store)
                .then(() => {
                    dispatchSetNotification(this.$store, {
                        type: AlertType.SUCCESS,
                        message: "User logged out successfully"
                    });

                    this.$router.push("/");
                })
                .catch(() => dispatchSetNotification(this.$store, {
                    type: AlertType.ERROR,
                    message: "Error occurred while logging out"
                }))
                .finally(() => dispatchClearNotifications(this.$store))
        }

    }
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    cursor: pointer;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.container {
  h1 {
    margin-bottom: 50px;
  }
}

.logo {
  display: block;
  margin-bottom: 20px;
}

</style>
