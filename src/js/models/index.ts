//Domain Models

export interface UploadedFile {
    upload_rel?: string;
    full_url?: string; //available if preview or already uploaded
    file?: Blob; //only available when making upload request to server
    name?: string; //available when making upload request to server or if server kept track of it. Contains original name
}
