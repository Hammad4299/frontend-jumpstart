import React, { RefObject } from 'react';
import { createStyles, Theme, withStyles, WithStyles, Input, Menu, MenuItem, StandardProps } from "@material-ui/core";
import { InputProps } from '@material-ui/core/Input';
import { defaultTo } from 'lodash-es';
import { GooglePlaceAutocompleteServiceWrapper, extractGooglePlaceComponents } from 'helpers';
import { StyleClassKey } from 'typehelper';
import { AppSelect, SimpleOption } from 'components';

const styles = (theme:Theme) => createStyles({
    root: {
        width: '100%'
    }
});

export type AddressFieldClassKey = StyleClassKey<typeof styles>;

interface AddressFieldProps extends StandardProps<{},AddressFieldClassKey>{
    value:string
    inputProps?:InputProps
    style?:React.CSSProperties
    onChange:(address:AddressAutoComplete)=>void
}

export interface AddressAutoComplete {
    street_address: string
    city: string
    state: string
    zipcode: string
    country: string
}

const decorator = withStyles(styles);


interface State {
    predictions:google.maps.places.AutocompletePrediction[]
    input:string
}

class Component extends React.PureComponent<AddressFieldProps,State> {
    protected service:GooglePlaceAutocompleteServiceWrapper
    protected ref:RefObject<HTMLDivElement>
    constructor(props:AddressFieldProps){
        super(props);
        this.ref = React.createRef();
        this.state = {
            predictions: [],
            input: ''
        };
    }
    componentDidMount() {
        this.service = new GooglePlaceAutocompleteServiceWrapper({
            input: '',
            types: ['address']
        }, this.ref.current);
    }
    render() {
        let { inputProps, onChange=()=>{},value = '', classes, ...rest } = this.props;
        value = defaultTo(value,'');
        
        let options:SimpleOption[] = [];
        if(this.state.predictions) {
            options = this.state.predictions.map(suggestion=>({
                value:suggestion.place_id,
                label:suggestion.description
            }));
            options.push({
                value: 'google',
                label: this.state.input
            })
        }
        
        const attribution = <span ref={this.ref}></span>;

        return (
            <React.Fragment>
                {attribution}
                <AppSelect value={{
                        value,
                        label: value
                    }}
                    showDropdownIndicator={false}
                    options={options}
                    fullWidth
                    isOptionDisabled={(option)=>option.value==='google'}
                    formatOptionLabel={(option)=>{
                        if(option.value!=='google') {
                            return option.label;
                        } else if(option.value==='google') {
                            return <img src={require('images/powered_by_google.png')} />;
                        }
                    }}
                onChange={(value:any)=>{
                    if(value.value) {
                        this.service.getGooglePlaceDetail({
                            placeId: value.value
                        }).then(resp=>{
                            onChange(extractGooglePlaceComponents(resp.detail));
                        })
                    }
                }}
                onInputChange={(a,b)=>{
                    if(a.length>0){
                        this.setState({
                            input: a
                        });
                        this.service.getGooglePlacePredictions(a).then((resp)=>{
                            this.setState({
                                predictions: resp.predictions
                            });
                        })
                    }
                }}/>
            </React.Fragment>
        );
    }
}
export const AddressField = decorator(Component)
export default AddressField;