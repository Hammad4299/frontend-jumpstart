import remoteRoutes from "externals/RemoteRoutes";
import { RoutingContext, BaseRoutingContext } from "routing";


export function routesForContext(context: RoutingContext = new BaseRoutingContext()) {
    return {
        server: {
            baseUrl: () => remoteRoutes.baseurl,
            sampleDelete: (id:string)=>remoteRoutes.baseurl.replace(':id',id),
            upload: {
                bulk: ()=>remoteRoutes.upload.bulk
            },
        },
        react: {
            root: () => context.getBaseUrl(),
            samplePage: (id = ":id") => context.buildUrl('sample/:id',{':id':id})
        }
    };
}

export type Routes = ReturnType<typeof routesForContext>