import Vue from "vue";
export class SessionApi extends Vue {
    static getUserSession($http, userName) {
        return $http.get(`/users?userName=${userName}`)
            .then((response) => {
            if (!response.data.length) {
                return null;
            }
            return response.data;
        })
            .catch(() => null);
    }
}
//# sourceMappingURL=session-api.js.map