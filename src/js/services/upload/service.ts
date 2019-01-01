
import { chunk } from 'lodash-es';
import { BaseService } from 'services';
import { UploadInfo, UploadFilesRequest } from './types';
import { WithValidityState, AppResponse } from 'types';
import { randomString } from 'helpers';

interface UploadConfig {
    onUploadProgress:(progressEvent:any, req:UploadFilesRequest)=>any
    batchPromise:(promise:Promise<WithValidityState<AppResponse<UploadResponse>>>, req:UploadFilesRequest)=>any
}

type UploadResponse = {
    [index:string]:UploadInfo
}


type UploadResponseFinal = WithValidityState<AppResponse<UploadResponse>>;
export class UploadService extends BaseService {
    upload(data: UploadFilesRequest, batchSize = 20, concurrent = 1, { batchPromise=()=>{}, onUploadProgress=()=>{} }:UploadConfig = { batchPromise: ()=>{}, onUploadProgress: ()=>{} }) {
        const d = new FormData();
        const chunks = chunk(data.file_infos, batchSize);
        const reqs = chunks.map((c):UploadFilesRequest=>{
            return {
                ...data,
                file_infos: c
            };
        });

        return Promise.all(reqs.map(req=>{
            return this.uploadBatch(req, (evt:any)=>{
                onUploadProgress(evt, req);
                return null;
            }).then(d=>{
                batchPromise(new Promise((resolve)=>{
                    resolve(d);
                }), req);
                return d;
            });
        })).then((data):UploadResponseFinal=>{
            let b:UploadResponse = {};
            data.reduce((prev,it)=>{
                const r = it.data;
                Object.keys(r).forEach(key=>{
                    prev[key] = r[key];
                });
                return prev;
            },b)
            return {
                validityState: {},
                data: b,
                status: true,
                errors: {}
            };
        });
    }

    buildUploadRequest<T>(data:T[], getFile:(item:T)=>{
        file?:Blob,
        name?:string,
        extra?:{[index:string]:any}
    }) {
        let uploadRequest:UploadFilesRequest = {
            file_infos: [],
            kind: null,
            files: {}
        };
        let map:{[idenfifier:string]:T} = {};
        data.forEach(item=>{
            const file = getFile(item);
            if(file) {
                const identifier = randomString(6);
                map[identifier] = item;
                uploadRequest.file_infos.push({
                    identifier,
                    name: file.name,
                    ...file.extra
                });
                uploadRequest.files[identifier] = file.file;
            }
        });

        return {
            request: uploadRequest,
            map: map
        };
    }

    fillMappedWithUploadResponse<T>(resp:UploadResponse, map:{[index:string]:T}, setUploadInfo:(item:T, info:UploadInfo)=>void) {
        Object.keys(resp).forEach(identifier=>{
            setUploadInfo(map[identifier],resp[identifier]);
        });
    }

    private uploadBatch(data: UploadFilesRequest, onUploadProgress:(progressEvent:any)=>{}) {
        const d = new FormData();
        d.append('file_infos',JSON.stringify(data.file_infos));
        d.append('kind',data.kind.toString());
        data.file_infos.forEach(info=>{
            d.append(info.identifier, data.files[info.identifier]);
        });

        return this.doServerXHR<UploadResponse>({
            url: this.routes.server.upload.bulk(),
            method: 'post',
            data: d,
            onUploadProgress: onUploadProgress
        });
    }
}