/**
 * Created by talha on 5/15/2018.
 */
import {Subtract} from 'utility-types';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import React from 'react';
import { AppStore, setBreadcrumbs } from 'redux-store';
import { BreadcrumbContextContract, BreadcrumbInfo } from 'breadcrumbs';
import { connect } from 'react-redux';

export interface UseBreadcrumbsInjectedProps {
    breadcrumbInjection?: {
        breadcrumbs?:BreadcrumbInfo[],
        breadcrumbForExample?: ()=>void
    }
}

type AvailableContext = BreadcrumbContextContract;
type ContextType = 'general';
type ArgType = 'simple'|'myLoadable1';

interface Arg {
    argType:ArgType
    value:any
}

type FuncType = keyof BreadcrumbContextContract;

/**
 * Coordinates with BreadcrumbContextContract. 
 * Can load unavailable data before coordination using deferred. 
 * Data Injected into Context is expected to be already loaded. It is only responsible for loading data require explicitly by context methods.
 */
function UseBreadcrumbs<WrappedProps extends UseBreadcrumbsInjectedProps>(WrappedComponent:React.ComponentType<WrappedProps>) {
    interface State {
        func:FuncType
        args:Arg[]
        ready:boolean
        contextType:ContextType
    }
    
    interface MappedProps {    
        breadcrumbs:BreadcrumbInfo[],
        breadcrumbContext:BreadcrumbContextContract
    }
    
    interface MappedDispatch {
        setBreadcrumbs:(crumbs:BreadcrumbInfo[])=>void
    }

    interface Props extends Mapped{

    }
    
    type Mapped = MappedDispatch & MappedProps;
    type ComponentProps = Subtract<WrappedProps, UseBreadcrumbsInjectedProps>;
    type HOCProps = Mapped;
    type OwnProps = Subtract<Props, Mapped> & ComponentProps;   //Props that are allowed to passed from Resulting component returned from HOC.

    const mapStateToProps = (store:AppStore, ownProps:OwnProps):MappedProps=>{
        return {
            breadcrumbs:store.breadcrumbs.breadcrumbs,
            breadcrumbContext:store.breadcrumbs.context
        };
    } 
    
    const mapDispatchToProps = (dispatch:ThunkDispatch<AppStore, void, AnyAction>, ownProps:OwnProps):MappedDispatch => {
        return {
            setBreadcrumbs:(crumbs:BreadcrumbInfo[])=>dispatch(setBreadcrumbs(crumbs)),
        } 
    }

    const enhancer = connect(mapStateToProps,mapDispatchToProps);

    return enhancer(
        class extends React.Component<HOCProps, State> {
            constructor(props:HOCProps) {
                super(props);
                this.state = {
                    args: [],
                    func: null,
                    ready: false,
                    contextType: 'general'
                };
            }

            protected setContextFunc(func:FuncType, args:(Arg|any)[], contextType:ContextType, ready = true) {
                if(args.length>0) {
                    args = args.map(arg=>{
                        return arg.argType ? arg : {
                            argType: 'simple',
                            value: arg
                        };
                    });
                }
                this.setState({
                    'args': args,
                    ready,
                    func,
                    contextType
                });
            }

            componentDidUpdate(nextProps:HOCProps, nextState:State) {
                const state = this.state;
                const props = this.props;
                if(state.func) {   //pending call to set breadcrumbs remains
                    //No pending data needs to be fetched
                    let allReady = !state.args.find((arg)=>arg.argType!=='simple')
                    let context:AvailableContext = null;

                    if(state.contextType === 'general') {
                        context = props.breadcrumbContext;
                    }
                    
                    if(allReady && context && (!state.ready || context.isReady())) {
                        context[state.func].apply(context,this.state.args.map(arg=>arg.value));
                        this.setState({
                            func: null
                        });
                    } else if (!allReady) {
                        let newArgs:Arg[] = [];
                        let changed = false;
                        state.args.map((arg,index)=>{
                            if(arg.argType==='simple') {
                                newArgs.push(arg);
                            } else if(arg.argType === 'myLoadable1') {
                                const isLoaded = true;
                                if(isLoaded) {  //loaded
                                    changed = true;
                                    newArgs.push({
                                        argType: 'simple',
                                        value: null//loaded value. null here for just demo
                                    });
                                } else {    //make call to load value. Add checks to ensure efficient loading/prevent loading/requesting load for same data
                                    
                                }
                            }
                        });
                        if(changed) {
                            this.setState({
                                args: newArgs
                            });
                        }
                    }
                }
                return this.props.breadcrumbs!==nextProps.breadcrumbs;
            }

            render() {
                const {breadcrumbs, breadcrumbContext, setBreadcrumbs, ...rest} = this.props;
                const tsBypass:WrappedProps = rest as any;
                
                return (
                    <React.Fragment>
                        <WrappedComponent
                            breadcrumbInjection={{
                                breadcrumbs: breadcrumbs,
                                breadcrumbForExample: ()=>this.setContextFunc('example',[setBreadcrumbs],'general'),
                            }}
                            {...tsBypass} />
                    </React.Fragment>
                );
            }
        }
    );
};

export default UseBreadcrumbs;