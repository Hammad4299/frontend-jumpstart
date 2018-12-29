export enum UploadKind {
    
}

export interface UploadFilesRequest {
    kind?:UploadKind
    file_infos:{
        [index:string]:any
        identifier:string
        name:string
    }[],
    files:{[index:string]:Blob}
}

export type UploadInfo = {
    upload_rel:string
}