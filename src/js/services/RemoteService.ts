import { AppResponse } from "models";
import { processResponse, getServerResponse} from "jquery-dependent/FormHelpers/Utils";
import csrftoken from 'externals/CSRFToken';
import { routes } from 'routing/Routes';
import axios, {AxiosResponse} from "axios";

export const serverApi = axios.create({
    headers: {
        'X-CSRF-TOKEN': csrftoken,
        'Accept': 'application/json'
    },
    baseURL: routes.baseUrl()
});

export type ServerApiResponse<T> = string|AppResponse<T>;

export default class RemoteService {
    protected defaultProcessResponse<T>(resp:AxiosResponse<ServerApiResponse<T>>):AppResponse<T> {
        const r = processResponse(getServerResponse<T>(resp.data));
        if(r!==null && r.status) {
            return r;
        }
        return null;
    }
}