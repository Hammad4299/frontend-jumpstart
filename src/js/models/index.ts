//Domain Models


export interface UploadedFile {
    upload_rel?:string
    full_url?:string
    file?:Blob
    name?:string
}