import { chunk } from "lodash-es"
import { BaseService } from "services"
import { UploadInfo, UploadFilesRequest, UploadKind } from "./types"
import { WithValidityState, AppResponse } from "types"
import { randomString } from "helpers"

interface UploadConfig {
    onUploadProgress: (progressEvent: any, req: UploadFilesRequest) => any
    batchPromise: (
        promise: Promise<WithValidityState<AppResponse<UploadResponse>>>,
        req: UploadFilesRequest
    ) => any
}

type UploadResponse = {
    [index: string]: UploadInfo
}

export interface UploadRequestMap<T> {
    [identifier: string]: T | string[]
    orderedIdentifiers?: string[]
}

type UploadResponseFinal = WithValidityState<AppResponse<UploadResponse>>
export class UploadService extends BaseService {
    upload(
        data: UploadFilesRequest,
        batchSize = 10,
        concurrent = 1,
        {
            batchPromise = () => {},
            onUploadProgress = () => {},
        }: UploadConfig = {
            batchPromise: () => {},
            onUploadProgress: () => {},
        }
    ) {
        const chunks = chunk(data.file_infos, batchSize)
        const reqs = chunks.map(
            (c): UploadFilesRequest => {
                return {
                    ...data,
                    file_infos: c,
                }
            }
        )

        return Promise.all(
            reqs.map(req => {
                return this.uploadBatch(req, (evt: any) => {
                    onUploadProgress(evt, req)
                    return null
                }).then(d => {
                    batchPromise(
                        new Promise(resolve => {
                            resolve(d)
                        }),
                        req
                    )
                    return d
                })
            })
        ).then(
            (data): UploadResponseFinal => {
                const b: UploadResponse = {}
                data.reduce((prev, it) => {
                    const r = it.data
                    Object.keys(r).forEach(key => {
                        prev[key] = r[key]
                    })
                    return prev
                }, b)
                return {
                    validityState: {},
                    data: b,
                    status: true,
                    errors: {},
                }
            }
        )
    }

    buildUploadRequest<T>(
        data: T[],
        getFile: (
            item: T
        ) => {
            file?: Blob
            name?: string
            extra?: { [index: string]: any }
        },
        kind: UploadKind = null
    ) {
        const uploadRequest: UploadFilesRequest = {
            file_infos: [],
            kind,
            files: {},
        }
        const map: UploadRequestMap<T> = {
            orderedIdentifiers: [],
        }
        data.forEach(item => {
            const file = getFile(item)
            if (file) {
                const identifier = randomString(6)
                map[identifier] = item
                map.orderedIdentifiers.push(identifier)
                uploadRequest.file_infos.push({
                    identifier,
                    name: file.name,
                    ...file.extra,
                })
                uploadRequest.files[identifier] = file.file
            }
        })

        return {
            request: uploadRequest,
            map: map,
        }
    }

    fillMappedWithUploadResponse<T>(
        resp: UploadResponse,
        map: UploadRequestMap<T>,
        setUploadInfo: (item: T, info: UploadInfo) => T
    ) {
        return map.orderedIdentifiers
            .filter(identifier => {
                return resp[identifier]
            })
            .map(identifier => {
                return setUploadInfo(map[identifier] as T, resp[identifier])
            })
    }

    private uploadBatch(
        data: UploadFilesRequest,
        onUploadProgress: (progressEvent: any) => {}
    ) {
        const d = new FormData()
        d.append("file_infos", JSON.stringify(data.file_infos))
        d.append("kind", data.kind.toString())
        data.file_infos.forEach(info => {
            d.append(info.identifier, data.files[info.identifier])
        })

        return this.doServerXHR<UploadResponse>({
            url: this.routes.server.upload.bulk(),
            method: "post",
            data: d,
            onUploadProgress: onUploadProgress,
        })
    }

    public uploadFileSimple(file: File): Promise<AppResponse<UploadInfo>> {
        const uploadRequest = this.buildUploadRequest<File>(
            [file],
            item => ({
                file: item,
                name: item.name,
            }),
            UploadKind.Simple
        )
        return this.upload(uploadRequest.request).then(p => {
            const finalResponse: AppResponse<UploadInfo> = {
                status: p.status,
                data: null,
                errors: p.errors,
            }
            if (p.status) {
                this.fillMappedWithUploadResponse(
                    p.data,
                    uploadRequest.map,
                    (item, info) => {
                        finalResponse.data = info
                        return item
                    }
                )
            }
            return finalResponse
        })
    }
}
