import { defaultTo, orderBy } from "lodash-es"

export type SortDirection = "asc" | "desc" | "none"

export interface ColumnSort {
    col: string
    dir?: SortDirection
}

export type Sorting = ColumnSort[]

export function sortData<T>(data: T[], orders: ColumnSort[]): T[] {
    const filteredOrders = orders.filter(order => order.dir !== "none")
    return orderBy(
        data,
        filteredOrders.map(({ col }) => col),
        filteredOrders.map(({ dir }) => dir as "asc")
    )
}

export function getColumnSort(sorting: Sorting, { col }: ColumnSort) {
    let spec = sorting.find(x => x.col === col)
    if (!spec) {
        spec = {
            col,
            dir: "none",
        }
    }
    return spec
}

export function addColumnSort(
    sort: ColumnSort,
    sorting: Sorting = []
): Sorting {
    sorting = defaultTo(sorting, [])

    if (sort.dir === "none") {
        sorting = sorting.filter(s => s.col !== sort.col)
    } else {
        const exists = sorting.find(a => a.col === sort.col)
        if (exists) {
            sorting = sorting.map(a => {
                if (a.col === sort.col) {
                    return sort
                }
                return a
            })
        } else {
            sorting.push(sort)
        }
    }

    return sorting
}

export function getToggledSortDirection(
    currentDirection: SortDirection
): SortDirection {
    return currentDirection === "asc"
        ? "desc"
        : currentDirection === "desc"
        ? "none"
        : "asc"
}
