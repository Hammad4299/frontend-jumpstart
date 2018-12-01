export interface ErrorInfo {
    hasError:boolean,
    errors:string[]
    error:string|null
}

export interface User {
    id?: number,
    username:string,
    password?:string
}

export * from './FieldsState'
export * from './Response'
export * from './Pagination'