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


export interface PaginatedResult<T> extends PaginationInfo {
    data: T[]
}

export type WithPaginationParams<T> = {
    [K in keyof T]: T[K]
} & {
    page: number|string
    per_page?: number|string
}

export type ExactTypeForMultiItemResult<T> = T extends PaginatedResult<infer TElem> ? PaginatedResult<TElem> : T extends (infer X)[] ? X[] : T;

export type MultiItemResultTypeFromRequestParam<T, TModel> = T extends WithPaginationParams<T> ? PaginatedResult<TModel> : TModel[];

export type MultiItemResult<T> = T[] | PaginatedResult<T>;

export function isPaginatedResult<T>(data:any):data is PaginatedResult<T> {
    return data && (<PaginatedResult<T>>data).per_page !== undefined;
}


export function paginate<T>(data:T[], paginationDef:PaginationInfo):PaginatedResult<T> {
    const start = (paginationDef.current_page-1)*paginationDef.per_page;
    return {
        data: data.slice(start, start + paginationDef.per_page),
        current_page: paginationDef.current_page,
        per_page: paginationDef.per_page,
        total:data.length
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

/**
 * Normalize service collection response or service paginated response to standard
 * @param responseData 
 */
export function normalizePaginatableData<T>(responseData: T[] | PaginatedResult<T>): {
    data: T[],
    paginationInfo: PaginationInfo
} {
    if (isPaginatedResult(responseData)) {
        return {
            data: responseData.data,
            paginationInfo: responseData
        }
    } else {
        return {
            data: responseData,
            paginationInfo: null
        }
    }
}