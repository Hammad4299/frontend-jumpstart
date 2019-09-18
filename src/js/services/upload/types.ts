import { UploadedFile } from "models";

export enum UploadKind {
    Simple = "simple"
}

export interface UploadFilesRequest {
    kind?: UploadKind;
    file_infos: {
        [index: string]: any;
        identifier: string;
        name: string;
    }[];
    files: { [index: string]: Blob };
}

export type UploadInfo = UploadedFile;
