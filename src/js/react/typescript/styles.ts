import { Theme } from "@material-ui/core";
import { ClassKeyOfStyles } from "@material-ui/styles";
import { CreateCSSProperties } from "@material-ui/styles/withStyles";

export type StyleClassKey<X> = ClassKeyOfStyles<X>; //withStyles HOC
export type StylesType<ClassKeysUnion extends string | number | symbol> = (
    theme: Theme,
) => Record<ClassKeysUnion, CreateCSSProperties<{}>>;
