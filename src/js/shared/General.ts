import { FieldsState, AppResponse, PaginatedResult, PaginationInfo, PaginationInfoDetail } from "models";
import { toNumber as _ToNumber } from 'lodash-es';

export function paginate<T>(data:T[], paginationDef:PaginationInfo):PaginatedResult<T> {
    const start = (paginationDef.current_page-1)*paginationDef.per_page;
    return {
        data: data.slice(start, start + paginationDef.per_page),
        current_page: paginationDef.current_page,
        per_page: paginationDef.per_page,
        total:data.length
    };
}


export function extractResponseErrors<T>(response:AppResponse<T>, defaultFields:string[] = []) {
    let toRet:FieldsState = new FieldsState(defaultFields);
    if(response!==null){
        for(const field in response.errors) {
            if(response.errors.hasOwnProperty(field)){
                const errArr = response.errors[field];
                toRet.setErrors(field,errArr);
            }
        }
    }

    return toRet;
}

export function filePreviewUrl(file:File) {
    const promise = new Promise<{
        preview_url: string
    }>((resolve)=>{
        let reader = new FileReader();

        reader.onload = (e:any) => {
            resolve({
                preview_url: e.target.result
            });
        }
    
        reader.readAsDataURL(file);
    });
    return promise;
}

export function randomString(length: number, chars: string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
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

export function toNumber(a:any) {
    if(a!==null && a!==undefined && !isNaN(a)) {
        return _ToNumber(a);
    } else {
        return null;
    }
}