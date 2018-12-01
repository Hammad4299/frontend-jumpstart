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
    limit?: number|string
}

export type ExactTypeForMultiItemResult<T> = T extends PaginatedResult<infer TElem> ? PaginatedResult<TElem> : T extends (infer X)[] ? X[] : T;

export type MultiItemResultTypeFromRequestParam<T, TModel> = T extends WithPaginationParams<T> ? PaginatedResult<TModel> : TModel[];

export type MultiItemResult<T> = T[] | PaginatedResult<T>;


export function isPaginatedResult<T>(data:any):data is PaginatedResult<T> {
    return (<PaginatedResult<T>>data).total !== undefined;
}
