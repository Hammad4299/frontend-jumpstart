import {ReactNode} from "react";
import {ListItemProps} from "@material-ui/core/ListItem";

export default interface SidebarItem extends ListItemProps {
    childs?:SidebarItem[],
    hasChilds:boolean,
    loaded?:boolean,
    active?:boolean,
    icon?:ReactNode,
    expanded?:boolean,
    route?:string,
    itemClicked?:(item:SidebarItem)=>void,
    expandClicked?:(e:React.MouseEvent<HTMLElement>,item:SidebarItem)=>void,
    identifier:string,
}