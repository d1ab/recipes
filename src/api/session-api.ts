
import Vue from "vue";
import {AxiosStatic} from "axios";
import {IUserSession} from "@/types";

export class SessionApi extends Vue {
    public static getUserSession($http: AxiosStatic, userName: string) {
        return $http.get<IUserSession[]>(`/users?userName=${userName}`)
            .then((response: any) => {
                if (!response.data.length) {
                    return null;
                }

                return response.data
            })
            .catch(() => null)
    }

}