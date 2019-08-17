import { Theme } from "@material-ui/core";
import { CreateCSSProperties } from "@material-ui/styles/withStyles";


export type StyleClassKey<X> = X extends (theme:Theme)=>Record<infer P,CreateCSSProperties<{}> | ((props: {}) => CreateCSSProperties<{}>)> ? P : never;
export type StylesType<ClassKeysUnion extends string|number|symbol> = (theme:Theme)=>Record<ClassKeysUnion,CreateCSSProperties<{}>>

