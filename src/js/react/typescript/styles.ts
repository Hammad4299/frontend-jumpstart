import { Theme } from "@material-ui/core";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

export type StyleClassKey<X> = X extends (theme:Theme)=>Record<infer P,CSSProperties> ? P : never;
export type StylesType<ClassKeysUnion extends string|number|symbol> = (theme:Theme)=>Record<ClassKeysUnion,CSSProperties>