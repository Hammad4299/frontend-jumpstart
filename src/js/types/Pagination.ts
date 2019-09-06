import { AppResponse } from "./Response";
import { Omit } from "utility-types";

export interface PaginationInfo {
    per_page:number,
    current_page:number,
    total:number
}

export interface PaginationInfoDetail extends PaginationInfo {
    startingItem?:number,
    endingItem?:number,
    totalPages?:number
}


export interface PaginatedResponse<T> extends AppResponse<T>, PaginationResponseInfo {
}

export interface PaginationResponseInfo {
    pagination_meta:PaginationInfo
}

export type PaginationParams = {
    page: number|string
    per_page?: number|string
}


export type WithPaginationParams<T> = {
    [K in keyof T]: T[K]
} & PaginationParams

export type PaginationRequestToPaginatedResponse<TRequestParams, T extends AppResponse<Y>, Y> = TRequestParams extends PaginationParams ? T & PaginationResponseInfo : T;

export function isPaginatedResult<T>(data:any):data is PaginatedResponse<T> {
    return data && (<PaginatedResponse<T>>data).pagination_meta !== undefined;
}


export function paginate<T>(data:T[], paginationDef:PaginationInfo):Omit<PaginatedResponse<T[]>,'status'|'errors'> {
    const start = (paginationDef.current_page-1)*paginationDef.per_page;
    return {
        data: data.slice(start, start + paginationDef.per_page),
        pagination_meta: {
            current_page: paginationDef.current_page,
            per_page: paginationDef.per_page,
            total:data.length
        }
    };
}

export function extractPaginationDetail(info:PaginationInfo):PaginationInfoDetail {
    return {
        ...info,
        startingItem: ((info.current_page-1)*info.per_page)+1,
        endingItem: Math.min(((info.current_page-1)*info.per_page)+info.per_page,info.total),
        totalPages: parseInt(Math.ceil(info.total/info.per_page).toString())
    }
}

export function getPagesRange(currentPage:number, endPage:number) {
    const pages:number[] = [];
    const lookup = 4;
    const tmpMin = Math.max(currentPage-lookup,1);
    const tmpMax = Math.min(currentPage+lookup,endPage);
    let max = Math.min(currentPage+lookup+(lookup-(currentPage-tmpMin)),endPage);
    let min = Math.max(currentPage-lookup-(lookup-(tmpMax-currentPage)),1);
    for(let x=min;x<=max;++x){
        pages.push(x);
    }

    return pages.filter(page=>page>=1&&page<=endPage);
}