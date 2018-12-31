import React from 'react';
import { createStyles, Theme, withStyles, WithStyles } from "@material-ui/core";
import Axios from 'axios';

import AppSelect, { OptionType } from '../presentational/AppSelect';
import {FixedSizeList} from 'react-window';
import { MenuListComponentProps } from 'react-select/lib/components/Menu';
import { createFilter } from 'react-select';
import { getFontStyle } from 'app-react/utility/Style';
import { createSelector } from 'reselect';

const styles = (theme:Theme) => createStyles({

});

interface OwnProps {
    api_key:string
    font?:Font
    onChange?:(font:Font)=>void
    variants?:FontVariant
}

interface State {
    options:OptionType[]
}


type Props = OwnProps;

const decorator = withStyles(styles);

type StyledProps = WithStyles<typeof styles> & Props;

const fontsList = {
    google: null as GoogleFont[]
}

let loading:boolean = false;

const loadedFontFamilies:{[family:string]:boolean} = {};

interface GoogleFont {
    kind: string
    family: string
    variant: string[]
    subsets: string[]
    files: string[]
}



class FontPicker extends React.PureComponent<StyledProps, State> {
    constructor(props:StyledProps) {
        super(props);
        this.state = {
            options: []
        };
    }

    componentDidMount() {
        if(!fontsList.google && !loading) {
            loading = true;
            Axios.get<{items:GoogleFont[]}>('https://www.googleapis.com/webfonts/v1/webfonts', {
                params: {
                    key: this.props.api_key
                }
            }).then(resp=>{
                if(resp.status) {
                    fontsList.google = resp.data.items;
                    this.initFonts();
                }
            });
        } 
        if(fontsList.google) {
            this.initFonts();
        }
    }

    protected initFonts() {
        this.setState({
            options: fontsList.google.map((font):OptionType=>{
                return {
                    ...font,
                    label: font.family,
                    value: font.family
                };
            })
        });
    }

    componentDidUpdate(props:StyledProps) {
        if(props.font.family !== this.props.font.family) {
            loadFamily(this.props.font.family);
        }
    }

    render() {
        const {classes, onChange = ()=>{}, font: {
            family = ''
        }, variants: {
            bold = false,
            italic = false
        }, ...rest} = this.props;
        const variants:FontVariant = {
            bold, italic
        };
        
        return (
            <div>
                <AppSelect 
                    components={{
                        MenuList: MenuList
                    }}
                    formatOptionLabel={(opt)=>{
                        return (
                            <span style={getFontStyle({
                                family: opt.family,
                                variants: variants
                            },false)}>{opt.family}</span>
                        )
                    }}
                    filterOption={createFilter({
                        ignoreCase: true,
                        trim: true
                    })}
                    fullWidth
                    value={{
                        family: family,
                        value: family
                    }}
                    onChange={(value:OptionType)=>onChange({
                        family: value.value
                    })}
                    options={this.state.options} />
            </div>
        )
    }
}

const filterOptions = createSelector(
    (props:MenuListComponentProps<OptionType>)=>props.options,
    (props:MenuListComponentProps<OptionType>)=>(props.selectProps.inputValue as string).toLowerCase().trim(),
    (options, filter)=>options.filter(opt=>{
        return filter==='' || opt.family.toLowerCase().indexOf(filter)!==-1
    })
)

function MenuList(props:MenuListComponentProps<OptionType>) {
    const childs = props.children;
    const itemHeight = 40;
    const filteredOptions = filterOptions(props);
    
    return (
        <FixedSizeList 
            width={"100%"}
            onItemsRendered={(nprops)=>{
                const indexes = [...Array(nprops.overscanStopIndex-nprops.overscanStartIndex+1).keys()].map(index=>index+nprops.overscanStartIndex);
                const families:string[] = indexes.filter((index)=>{
                    const family = filteredOptions[index].family;
                    return !loadedFontFamilies[family];
                }).map(index=>{
                    return filteredOptions[index].family;
                });
                
                
                families.forEach(fam=>{
                    loadedFontFamilies[fam] = true;
                });
                
                if(families.length>0) {
                    WebFont.load({
                        google: {
                            families
                        }
                    });
                }
            }}
            itemSize={itemHeight} 
            height={itemHeight*5} 
            itemCount={filteredOptions.length}>
            {(renderProps)=><div style={renderProps.style}>{childs[renderProps.index]}</div>}
        </FixedSizeList>
    )
}

export default decorator(FontPicker);

export type FontPickerProps = StyledProps;