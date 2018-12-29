import { defaultTo } from "lodash-es";

export type SortDirection = 'asc'|'desc'|'none';

export interface ColumnSort {
    col:string
    dir?:SortDirection
    position:number
}

export type Sorting = ColumnSort[];


export function getColumnSort(sorting:Sorting, {col, position}:ColumnSort) {
    let spec = sorting.find(x=>x.col===col);
    if(!spec) {
        spec = {
            col,
            position,
            dir: 'none'
        };
    }
    return spec;
}

export function addColumnSort(sort:ColumnSort, sorting:Sorting = []):Sorting {
    sorting = defaultTo(sorting,[]);
    let spec = sorting.filter(s=>s.col!==sort.col);
    spec.push(sort);
    spec = spec.sort((pre,current)=>{
        return pre.position === current.position ? 0 : 
            pre.position<current.position ? -1 : 1;
    });
    
    return spec;
}

export function getToggledSortDirection(currentDirection:SortDirection):SortDirection {
    return currentDirection === 'asc' ? 'desc' : 
                    currentDirection === 'desc' ? 'none' : 'asc';
}