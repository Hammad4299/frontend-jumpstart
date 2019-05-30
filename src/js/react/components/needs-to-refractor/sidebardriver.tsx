import withActiveLocation from 'app-react/HOC/WithActiveLocation';
import React,{ReactNode} from "react";
import {defaultTo} from 'lodash-es';
import {TextField, InputAdornment, ListItemIcon, ListItemText, List,ListItem,Theme, WithStyles, Avatar, Collapse, Typography} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import Sidebar from "components/presentational/Sidebar";
import createStyles from "@material-ui/core/styles/createStyles";
import { DrawerProps } from "@material-ui/core/Drawer";
import { Icon } from "@material-ui/core";
import ISidebarItem from "interfaces/ISidebarItem";
import SidebarItem from "components/presentational/SidebarItem";
import { LoggedInUser, userHasAccess } from "models/User";
import UserPresenter from "components/presentational/UserPresenter";
import { AppStore } from "redux-store";
import { ThunkDispatch } from "redux-thunk";
import { logoutUser } from "user-service";
import { AnyAction } from "redux";
import { connect } from "react-redux";
import RouteProvider, { adminRouteProvider, AdminRoutingContext } from "routing/RoutesProvider";
import { IClient } from "models/Client";
import { ActiveLocationInjectedProps } from "app-react/HOC/WithActiveLocation";
import withRoutingContext, { WithRoutingContextInjectedProps } from 'app-react/HOC/WithRoutingContext';
import RoleLevel from 'models/RoleLevel';
import withLoggedInUser, { WithLoggedInUserInjectedProps } from 'app-react/HOC/WithLoggedInUser';
import { RouteComponentProps, withRouter, Link } from 'react-router-dom';
import UseBreadcrumbs, { UseBreadcrumbsInjectedProps } from 'app-react/HOC/UseBreadcrumbs';
import withLocationVisitorTypes, { WithLocationVisitorTypesInjectedProps } from 'app-react/HOC/WithLocationVisitorTypes';

const styles = (theme:Theme) => createStyles({
    headerPresenterRoot: {
        '& *': {
            color: theme.header.text,
        }
    },
    navPresenterRoot: {
        '& *': {
            color: theme.palette.text.primary
        }
    },
    mainNav: {
        '& ul': {
            paddingLeft: theme.spacing(2)
        }
    },
    userNavList: {
        '& *': {
            color: theme.palette.text.primary
        }
    },
    navListDynamic: {
        '& span.material-icons': {
            overflow: 'visible'
        },
        '& ul': {
            '&>a>:first-child':{
                paddingLeft: theme.spacing(3),
            },
            '& ul': {
                '&>a>:first-child':{
                    paddingLeft: theme.spacing(6)
                }
            }
        }
    }
});

const decorator = withStyles(styles);

type StyledProps = BackendSidebarProps & WithStyles<typeof styles> & RouteComponentProps<any>;

interface BackendSidebarProps extends WithLoggedInUserInjectedProps, DrawerProps, ActiveLocationInjectedProps, WithRoutingContextInjectedProps, WithLocationVisitorTypesInjectedProps {
    logoutClicked:()=>void,
    clients:IClient[],
    loggedInUser: LoggedInUser
}

interface State {
    itemsState:ItemStateMap
    searchInput:string
}

interface SidebarItemState {
    expanded:boolean
}

interface ItemStateMap {
    [identifier:string]:SidebarItemState
}

class BackendSidebar extends React.PureComponent<StyledProps, State> {
    constructor(props:StyledProps) {
        super(props);
        this.state = {
            itemsState: {},
            searchInput: ''
        }
        this.toggleSidebarItem = this.toggleSidebarItem.bind(this);
    }

    protected getStateForItem(identifier:string):SidebarItemState {
        const state = defaultTo(this.state.itemsState[identifier], {
            loaded: true,
            expanded: false
        });
        return state;
    }

    protected toggleSidebarItem(e:React.MouseEvent<HTMLElement>, { identifier }:{identifier:string}) {
        e.preventDefault();
        e.stopPropagation();
        const preState = this.getStateForItem(identifier);
        
        this.setState({
            itemsState: {
                ...this.state.itemsState,
                [identifier]: {
                    ...preState,
                    expanded: !preState.expanded
                }
            }
        });
    }

    protected buildSidebarItems(item:ISidebarItem):ReactNode {
        let childs:ReactNode = item.hasChilds && item.childs ?
        <List>
            {item.childs.map((item)=>(
                this.buildSidebarItems(item)
            ))}
        </List>: null;
    
        
        return userHasAccess(this.props.loggedInUser, item.accessRequirement) ? 
        (
            <SidebarItem {...item} key={item.identifier}>
                {childs}
            </SidebarItem>
        )  : null;
    }
    
    protected getLocationRouteProvider() {
        return this.props.locationRoutingContext ? RouteProvider(this.props.locationRoutingContext) : RouteProvider(new AdminRoutingContext());
    }

    protected getBaseSidebarItems() {
        const props = this.props;
        const provider = this.getLocationRouteProvider();
        let locationItems:ISidebarItem[] = [];
        if(props.activeLocationId) {
           locationItems = [
                {
                    identifier: "visitor settings",
                    title: "Visitor Settings",
                    hasChilds: true,
                    button: true,
                    route: provider.react.backend.visitorSetting.root(),
                    childs: [
                        {
                            identifier: "video library",
                            title: "Video Library",
                            route: provider.react.backend.visitorSetting.videoLibrary.index(),
                            hasChilds: false,
                            button: true,
                        },
                        {
                            identifier: "quiz library",
                            route: provider.react.backend.visitorSetting.quizLibrary.index(),
                            title: "Quiz Library",
                            hasChilds: false,
                            button: true,
                        },
                        {
                            identifier: "visitor types",
                            title: "Visitor Types",
                            hasChilds: this.props.allVisitorTypes ? this.props.allVisitorTypes.length>0 : false,
                            childs: this.props.allVisitorTypes ? this.props.allVisitorTypes.map(visitorType=>{
                                const item:ISidebarItem = {
                                    identifier: `visitor-type-${visitorType.id}`,
                                    button: true,
                                    title: visitorType.name,
                                    hasChilds: false,
                                    route: provider.react.backend.visitorSetting.visitorTypes.visitorTypeSetting(visitorType.id.toString())
                                };
                                return item;
                            }) : [],
                            expanded: false,
                            button: true,
                            route: provider.react.backend.visitorSetting.visitorTypes.index()
                        },
                        {
                            identifier: "kiosks",
                            title: "Kiosks",
                            hasChilds: false,
                            button: true,
                            route: provider.react.backend.visitorSetting.kiosks.index()
                        },
                        {
                            identifier: "notifications",
                            title: "Notifications",
                            route: provider.react.backend.visitorSetting.notifications.index(),
                            hasChilds: false,
                            button: true,
                        },
                    ],
                    icon: <Icon className={'fas fa-address-card'} style={{color:'#6defb3'}} />
                },
                {
                    identifier: "user settings",
                    title: "User Settings",
                    hasChilds: true,
                    button: true,
                    route: provider.react.backend.clientSetting.root(),
                    childs: [
                        {
                            identifier: "departments",
                            title: "Departments",
                            route: provider.react.backend.clientSetting.departments.index(),
                            hasChilds: false,
                            button: true,
                        },
                        {
                            identifier: "employee info",
                            title: "Employee Info",
                            route: provider.react.backend.clientSetting.employeeInfo.index(),
                            hasChilds: false,
                            button: true,
                        },
                        {
                            identifier: "user access",
                            title: "User Access",
                            route: provider.react.backend.clientSetting.userAccess.index(),
                            hasChilds: false,
                            button: true,
                        },
                    ],
                    expanded: true,
                    icon: <Icon className={'fas fa-tv'} style={{color:'#8749ec'}} />
                },
                {
                    identifier: "visitor reporting",
                    title: "Visitor Reporting",
                    hasChilds: true,
                    button: true,
                    route: provider.react.backend.visitorReporting.root(),
                    childs: [
                        {
                            identifier: "visitors",
                            title: "Visitors",
                            route: provider.react.backend.visitorReporting.checkedIn.index(),
                            hasChilds: false,
                            button: true,
                        },
                        {
                            identifier: "reports",
                            route: provider.react.backend.visitorReporting.reports.index(),
                            title: "Reports",
                            hasChilds: false,
                            button: true,
                        }
                    ],
                    expanded: true,
                    icon: <Icon className={'fas fa-flag'} style={{color:'#dad45c'}} />
                }
           ];
        }

        let sideBarItems:ISidebarItem[] = [
            {
                identifier: "clients",
                route: adminRouteProvider.react.backend.clients(),
                button: true,
                title: "Client",
                accessRequirement: { level: RoleLevel.SuperAdmin },
                hasChilds: true,
                childs: this.props.clients.map(client=>{
                    const item:ISidebarItem = {
                        identifier: `client-${client.id}`,
                        button: true,
                        title: client.name,
                        hasChilds: false,
                        icon: <Avatar style={{display: 'inline-block'}} src={client.avatar_url} />,
                        route: adminRouteProvider.react.backend.locations({clientId: client.id.toString()})
                    };
                    return item;
                }),
                icon: <Icon className={'fas fa-users'} style={{color:'#4580fe'}} />
            },
            ...locationItems,
            {
                identifier: "users",
                accessRequirement: { level: RoleLevel.SuperAdmin },
                route: adminRouteProvider.react.backend.users(),
                button: true,
                title: "Users",
                hasChilds: false,
                icon: <Icon className={'fas fa-users'} style={{color:'#4580fe'}} />
            },
            {
                identifier: "logout",
                title: "Logout",
                hasChilds: false,
                button: true,
                itemClicked: props.logoutClicked,
                icon: <Icon className={'fas fa-sign-out-alt'} style={{color:'#ed4749'}} />
            },
        ];
        sideBarItems = sideBarItems.map(i=>this.search(i)).filter(i=>i.identifier!==null);
        sideBarItems = sideBarItems.map(i=>this.setCommonItemProps(i));
        this.setActive(sideBarItems);
        return sideBarItems;
    }
    
    protected search(item:ISidebarItem):ISidebarItem {
        const toRet = {
            ...item,
            ...this.getStateForItem(item.identifier),
            itemClicked: item.itemClicked,
            expandClicked: this.toggleSidebarItem,
            childs: item.hasChilds && item.childs ? item.childs.map(i=>this.search(i)).filter(i=>i.identifier!==null) : []
        };
        
        toRet.identifier = item.title.toLowerCase().indexOf(this.state.searchInput.toLowerCase()) !== -1 || toRet.childs.length>0 ? toRet.identifier :  null;
        return toRet;
    }
    
    protected setActive(item:ISidebarItem[]) {
        let active = false;
        item.forEach(i=>{
            if(!active) {
                active = this.markActiveItem(i);
            }
        });
        if(!active) {
            //must be dynamic data. In that case fallback to breadcrumbs
            let paths = this.props.location.pathname.split('/');
            paths.splice(paths.length-1,1);
            while(paths.length>0 && !active) {
                const path = paths.join('/');
                paths.splice(paths.length-1,1);
                item.forEach(i=>{
                    if(!active) {
                        active = this.markActiveItem(i,path);
                    }
                });
            }
        }
        return item;
    }
    
    protected markActiveItem(item:ISidebarItem, path = this.props.location.pathname):boolean {
        item.active = item.route === path;
        let childActive = false;
        if(!item.active && item.hasChilds && item.childs) {
            item.childs.forEach(i=>{
                if(!childActive) {
                    childActive = this.markActiveItem(i, path);
                }
            });
        }
        item.active = item.active || childActive;
        return item.active;
    }

    protected setCommonItemProps(item:ISidebarItem):ISidebarItem {
        return {
            ...item,
            ...this.getStateForItem(item.identifier),
            itemClicked: item.itemClicked,
            expandClicked: this.toggleSidebarItem,
            childs: item.expanded && item.hasChilds && item.childs ? item.childs.map(i=>this.setCommonItemProps(i)) : item.childs
        };
    }

    protected getSidebarNav(items:ISidebarItem[]):ReactNode {
        const {classes} = this.props;
        return (
            <React.Fragment>
                {this.userActionsNavList()}
                <List className={classes.mainNav}>
                    <ListItem>
                        <TextField
                            placeholder={"Search"}
                            value={this.state.searchInput}
                            onChange={(e)=>this.setState({
                                searchInput: e.target.value
                            })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment style={{
                                        marginLeft: '12px'
                                    }} position="start">
                                        <Icon className={'fas fa-search'} style={{color: '#aaa'}}/>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </ListItem>
                    <ListItem >
                        <Typography style={{color:'#ccc'}}>Navigation</Typography>
                    </ListItem>
                </List>
                <List className={classes.navListDynamic}>
                    {items.map((item)=>(
                        this.buildSidebarItems(item)
                    ))}
                </List>
            </React.Fragment>
        )
    }

    protected userActionsNavList(){
        const props = this.props;
        const {classes} = this.props;
        return (
            <List className={classes.userNavList}>
                <ListItem key={'user-indicator'} onClick={(e)=>this.toggleSidebarItem(e,{identifier: 'user-actions'})}>
                    <UserPresenter name={props.loggedInUser.display_name} imageUrl={props.loggedInUser.image_url} classes={{
                        root: classes.navPresenterRoot
                    }} />
                </ListItem>
                <Collapse in={this.getStateForItem('user-actions').expanded} unmountOnExit={true}>
                    <List>
                        <ListItem {...{
                            to: userHasAccess(this.props.loggedInUser, {
                                level: RoleLevel.SuperAdmin
                            }) ? adminRouteProvider.react.backend.users() : this.getLocationRouteProvider().react.backend.clientSetting.userAccess.index()
                        }} component={Link} key={'user-settings'} button >
                            <ListItemIcon>
                                <Icon className={'fas fa-user'} />
                            </ListItemIcon>
                            <ListItemText>User Settings</ListItemText>
                        </ListItem>
                        <ListItem key={'user-logout'} button onClick={props.logoutClicked}>
                            <ListItemIcon>
                                <Icon className={'fas fa-sign-out-alt'}/>
                            </ListItemIcon>
                            <ListItemText>Logout</ListItemText>
                        </ListItem>
                    </List>
                </Collapse>
            </List>
        );
    }

    render() {
        const { 
            forceVisitorTypesRefresh, 
            allVisitorTypes, 
            mainRoutingContext, 
            match, 
            staticContext, 
            loginSessionInfo, 
            locationRoutingContext, 
            classes,
            loggedInUser,
            logoutClicked, 
            activeLocationId, 
            activeLocation, 
            setActiveLocation, 
            ...rest
        } = this.props;
        const sideBarItems = this.getSidebarNav(this.getBaseSidebarItems());

        return (
            <Sidebar {...rest}>
                {sideBarItems}
            </Sidebar>
        )
    }
}

const mapStateToProps = (state:AppStore)=>({
    clients: state.frontend.clientsIndex.clients ? state.frontend.clientsIndex.clients.map(index=>state.data.clients[index]) : []
})

const mapDispatchToProps = (dispatch:ThunkDispatch<AppStore,void,AnyAction>)=>({
    logoutClicked:()=>dispatch(logoutUser()),
})

export default withRouter(
    connect(mapStateToProps,mapDispatchToProps)(
        withLocationVisitorTypes(
            withRoutingContext(
                withLoggedInUser(
                    withActiveLocation(
                        decorator(
                            BackendSidebar
                        )
                    )
                )
            )
        )
    )
);