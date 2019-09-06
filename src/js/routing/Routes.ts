import { RoutingContext, BaseRoutingContext } from "./context";


export function routesForContext(context: RoutingContext = new BaseRoutingContext()) {
    return {
        server: {
            root: () => context.getBaseUrl(),
            upload: (
                (base:string)=>({
                    bulk: ()=>`${base}/upload/bulk`
                })
            )('')
        },
        react: {
            samplePage: (id = ":id") => context.buildUrl('sample/:id',{':id':id})
        }
    };
}

export type Routes = ReturnType<typeof routesForContext>