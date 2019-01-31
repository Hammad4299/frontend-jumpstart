import UseBreadcrumbs, { UseBreadcrumbsInjectedProps } from 'app-react/HOC/UseBreadcrumbs';
import * as React from 'react';
import { defaultTo, isEqual } from 'lodash-es';
import { Theme, WithStyles, Select, MenuItem, Paper, Divider, Grid, Hidden } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import ContentContainer from "components/presentational/ContentContainer";
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {AppStore} from "redux-store";
import {ThunkDispatch} from "redux-thunk";
import { Typography } from "@material-ui/core";
import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import PageInfo from 'components/presentational/PageInfo';
import AttachedTabs from 'app-react/components/presentational/AttachedTabs';
import AttachedTab from 'app-react/components/presentational/AttachedTab';
import AppTabsContent from 'app-react/components/presentational/AppTabsContent';
import { BackgroundType } from 'models/BackgroundType';
import { KioskResourceType, KioskResource, ImageResource } from 'models/KioskResource';
import { toNumber } from 'shared/utility';
import SelectableImage from 'app-react/components/presentational/SelectableImage';
import FileDropzone from 'app-react/components/presentational/FileDropzone';
import { SolidColorPicker } from 'app-react/components/presentational/SolidColorPicker';
import { GradientColorPicker } from 'app-react/components/presentational/GradientColorPicker';

import {
    createKioskResource,
    deleteKioskResource,
    getKioskResources,
    KioskResourceCreateRequestParameters,
    KioskResourceIndexRequestParameters
} from 'services/backend/kioskresource';
import { ThemeSetting, ThemeSettingIdentifier, ThemeBackground, ThemeLogo, ButtonSetting, ImageBackground, ButtonSpec, BackgroundImage } from 'models/ThemeSetting';
import { GetKioskThemeRequestParameters, getKioskTheme, createUpdateKioskTheme, KioskThemeCreateUpdateRequestParameters } from 'services/backend/kiosktheme';
import { KioskThemeSetting } from 'models/KioskThemeSetting';
import AppButton from 'app-react/components/presentational/AppButton';
import SiteConfig from 'externals/SiteConfig';
import { ThemePreview } from 'app-react/components/presentational/kiosk/ThemePreview';
import FontPickerWithVariants, { FontWithVariants } from 'app-react/components/container/FontPickerWithVariants';
import ShapedButton, { ButtonShape } from 'app-react/components/presentational/ShapedButton';
import classNames from 'classnames';
import { FileWithPreview } from 'react-dropzone';
import { Color } from 'models/Color';
import { GradientColor, GradientType } from 'models/Gradient';
import FontPicker from 'app-react/components/container/FontPicker';

const styles = (theme:Theme) => createStyles({
    createButtonContainer: {
        justifyContent: 'flex-end',
        display: 'flex',
        marginBottom: theme.spacing.unit
    },
    preview: {
        height: '500px',
        width: '500px',
        marginTop: 10
    },
    tabsContent: {
    },
    tabContent: {
    },
    tabContentHeader: {
        display: 'flex'
    },
    selected: {

    },
    buttonItem: {
        padding: theme.spacing.unit*2,
        '&$selected': {
            background: theme.palette.grey[200]
        }
    },
    tabContentTitle: {
        flexGrow: 1
    },
    buttonShapesContainer: {
        border: `1px ${theme.palette.grey[200]} solid`,
        padding: theme.spacing.unit*2
    },
    imagesContainer: {
        display:'flex',
        flexWrap: 'wrap'
    },
    selectableImageImg: {
        width: '200px',
        height: 'auto'
    },
    flex: {
        display: 'flex',
        alignItems: 'center'
    },
    dropzone: {
        width: '100%',
        height: '300px'
    },
    uploadSection: {
        flexGrow: 1
    },
    backgroundPreviewContainer: {
        display: 'flex',
        justifyContent: 'flex-end'
    }
});

const decorator = withStyles(styles);

interface MappedProps {
    backgroundImageResources?:KioskResource[]
    logoImageResources?:KioskResource[]
    resourceCreatingUpdate?:boolean
    themeSetting?:ThemeSetting
    themeSaving?:boolean
}

interface MappedDispatch {
    saveKioskTheme?:(params:KioskThemeCreateUpdateRequestParameters)=>void
    getKioskTheme?:(params:GetKioskThemeRequestParameters)=>void
    loadKioskResoruces?:(params:KioskResourceIndexRequestParameters)=>void
    createKioskResource?:(params:KioskResourceCreateRequestParameters)=>void
    deleteKioskResource?:(id:number)=>void
}

interface Props  extends UseBreadcrumbsInjectedProps {
}

type MapStateProps = RouteComponentProps<any> & Props & MappedProps & MappedDispatch;

type StyleProps = WithStyles<typeof styles>;

type StyledProps = MapStateProps & StyleProps;

type CommonTabProps = {
    preview:React.ReactNode
};

interface State {
    activeTab:number,
    themeSetting:ThemeSetting
}

class ThemingRoot extends React.PureComponent<StyledProps, State> {
    protected cached:{[key:string]:any};
    constructor(props:StyledProps) {
        super(props);
        this.cached = {};
        this.state = {
            activeTab: 0,
            themeSetting: null
        }
        this.changeBackground = this.changeBackground.bind(this);
        this.changeLogo = this.changeLogo.bind(this);
        this.changeFont = this.changeFont.bind(this);
        this.changeButtonSetting = this.changeButtonSetting.bind(this);
        this.uploadImageResources = this.uploadImageResources.bind(this);
        this.changeBackgroundType = this.changeBackgroundType.bind(this);
        this.deleteKioskResource = this.deleteKioskResource.bind(this);
    }

    protected changeLogo(logo: ThemeLogo) {
        this.setState({
            themeSetting: {
                ...this.state.themeSetting,
                [ThemeSettingIdentifier.setting_logo]: logo
            }
        })
    }

    protected changeFont(font: FontWithVariants) {
        this.setState({
            themeSetting: {
                ...this.state.themeSetting,
                [ThemeSettingIdentifier.setting_font]: font
            }
        })
    }

    protected changeBackground(background: ThemeBackground) {
        this.setState({
            themeSetting: {
                ...this.state.themeSetting,
                [ThemeSettingIdentifier.setting_bg]: background
            }
        })
    }

    protected changeBackgroundType(type: BackgroundType) {
        const bgSetting = this.state.themeSetting[ThemeSettingIdentifier.setting_bg];
        this.cached[bgSetting.type] = this.state.themeSetting[ThemeSettingIdentifier.setting_bg].value;
        if(type===BackgroundType.solidColor) {
            this.changeBackground({
                type: type,
                value: defaultTo<Color,Color>(this.cached[type],{
                    a: 255, b: 255, g: 255, r: 255
                })
            });
        } else if(type===BackgroundType.gradientColor) {
            this.changeBackground({
                type: type,
                value: defaultTo<GradientColor,GradientColor>(this.cached[type],{
                    colorStops: [],
                    type: GradientType.linear,
                    param: {
                        angle: {
                            unit: 'deg',
                            value: 0
                        }
                    }
                })
            });
        } else {
            this.changeBackground({
                type: type,
                value: defaultTo<ImageBackground,ImageBackground>(this.cached[type],{
                    file: {
                        full_url: null,
                        upload_rel: null,
                        file: null
                    }
                })
            });
        }
    }

    protected changeButtonSetting(config:ButtonSetting) {
        this.setState({
            themeSetting: {
                ...this.state.themeSetting,
                [ThemeSettingIdentifier.setting_button]: {
                    ...this.state.themeSetting[ThemeSettingIdentifier.setting_button],
                    ...config
                }
            }
        })
    }

    protected loadKioskThemeSetting() {
        this.props.getKioskTheme({
            kiosk_id: this.getKioskId()
        });
    }

    protected uploadImageResources(type:KioskResourceType.BackgroundImage|KioskResourceType.LogoImage,files:File[]) {
        const kioskId = this.getKioskId();
        const resources = [...Array(files.length).keys()].map((index):KioskResource=>{
            return {
                kiosk_id: kioskId,
                resource_type: type,
                data: {
                    file: files[index]
                }
            };
        });
        this.props.createKioskResource({
            kiosk_id: kioskId,
            resources: resources
        });
    }

    protected deleteKioskResource(id:number|string) {
        this.props.deleteKioskResource(toNumber(id));
    }

    protected reloadKioskResources() {
        this.props.loadKioskResoruces({
            kiosk_id: this.getKioskId()
        });
    }

    protected initThemeSettingState() {
        if(this.props.themeSetting) {
            this.setState({
                themeSetting: {
                    ...this.props.themeSetting
                }
            });
        }
    }

    componentDidUpdate(prevProps:StyledProps) {
        if(prevProps.resourceCreatingUpdate !== this.props.resourceCreatingUpdate && !this.props.resourceCreatingUpdate) {  //recently created or updated
            this.reloadKioskResources();
        }

        if(prevProps.themeSetting !== this.props.themeSetting) {
            this.initThemeSettingState();
        }
    }

    componentDidMount() {
        this.props.breadcrumbInjection.breadcrumbsForTheme(this.getKioskId());
        this.loadKioskThemeSetting();
        this.initThemeSettingState();
        this.reloadKioskResources();
    }

    protected getKioskId() {
        return this.props.match.params['kioskId'];
    }

    render() {
        const { classes, match, history } = this.props;
        const { themeSetting } = this.state;
        const preview = <Preview themeSetting={themeSetting} />
        return (
            <React.Fragment>
                <PageInfo title={'Theming'} explanation={(
                    <Typography>TODO</Typography>
                )} />
                <div className={classes.createButtonContainer}>
                    <AppButton disabled={this.props.themeSaving} 
                        onClick={()=>
                            this.props.saveKioskTheme({
                                kiosk_id: this.getKioskId(),
                                setting: {
                                    ...this.state.themeSetting,
                                    setting_general: {
                                        ...this.state.themeSetting[ThemeSettingIdentifier.setting_general],
                                        textColor: this.state.themeSetting[ThemeSettingIdentifier.setting_button].primary.background
                                    }
                                }
                            })
                    }>Save</AppButton>
                </div>
                <AttachedTabs value={this.state.activeTab} onChange={(e,index)=>this.setState({activeTab: index})}>
                    <AttachedTab label={'Background'} />
                    <AttachedTab label={'Logo'} />
                    <AttachedTab label={'Buttons'} />
                    <AttachedTab label={'Font'} />
                </AttachedTabs>
                <ContentContainer style={{
                    height: 700
                }}>
                <FontPicker api_key={SiteConfig.googleFontApiKey} variants={{bold:true,italic:true}} font={{
                        family: 'Lato'
                    }} onChange={(f)=>{
                            
                        }} />
                        <FontPicker api_key={SiteConfig.googleFontApiKey} variants={{bold:true,italic:true}} font={{
                        family: 'Lato'
                    }} onChange={(f)=>{
                            
                        }} />
                        <FontPicker api_key={SiteConfig.googleFontApiKey} variants={{bold:true,italic:true}} font={{
                        family: 'Lato'
                    }} onChange={(f)=>{
                            
                        }} />
                        <FontPicker api_key={SiteConfig.googleFontApiKey} variants={{bold:true,italic:true}} font={{
                        family: 'Lato'
                    }} onChange={(f)=>{
                            
                        }} />
                    {/* <AppTabsContent classes={{root: classes.tabsContent}} index={this.state.activeTab} onChangeIndex={(i)=>this.setState({activeTab: i})}> */}
                    
                        {/* {themeSetting ? <BackgroundTab changeBackground={this.changeBackground} deleteKioskResource={this.deleteKioskResource} uploadImageResources={this.uploadImageResources}
                                            changeBackgroundType={this.changeBackgroundType}
                                            setting={themeSetting[ThemeSettingIdentifier.setting_bg]} resources={this.props.backgroundImageResources} resourceCreatingUpdate={this.props.resourceCreatingUpdate}
                                            preview={this.state.activeTab===0 ? preview : null}
                                             /> : <span></span>} */}
                        {/* {themeSetting ? <LogoTab changeLogo={this.changeLogo} deleteKioskResource={this.deleteKioskResource} uploadImageResources={this.uploadImageResources}
                                            setting={themeSetting[ThemeSettingIdentifier.setting_logo]} resources={this.props.logoImageResources} resourceCreatingUpdate={this.props.resourceCreatingUpdate}
                                            preview={this.state.activeTab===1 ? preview : null}
                                             />  : <span></span>} */}
                        {/* {themeSetting ? <ButtonTab changeButtonSetting={this.changeButtonSetting} 
                                            preview={this.state.activeTab===2 ? preview : null}
                                            setting={themeSetting[ThemeSettingIdentifier.setting_button]} /> 
                                            : <span></span>} */}
                        {/* {themeSetting ? <FontTab changeFont={this.changeFont} 
                                            preview={this.state.activeTab===3 ? preview : null}
                                            setting={themeSetting[ThemeSettingIdentifier.setting_font]} /> 
                                            : <span></span>} */}
                    {/* </AppTabsContent> */}
                </ContentContainer>
            </React.Fragment>
        );
    }
}

const mapStateToProps = ({frontend,data}:AppStore, props: MapStateProps):MappedProps => {
    const resources:KioskResource[] = Object.keys(data.kioskResources).map(id=>data.kioskResources[id]);
    const kioskId = props.match.params['kioskId'];
    return {
        logoImageResources: resources.filter(res=>res.resource_type===KioskResourceType.LogoImage),
        themeSetting: defaultTo<KioskThemeSetting>(data.kioskThemes[kioskId],{kiosk_id:null, setting: null}).setting,
        backgroundImageResources: resources.filter(res=>res.resource_type===KioskResourceType.BackgroundImage),
        resourceCreatingUpdate: frontend.kioskResourceCreateUpdate.creating,
        themeSaving: frontend.kioskThemeCreateUpdate.creating
    };
};

const mapDispatchToProps = (dispatch:ThunkDispatch<AppStore, void, AnyAction>):MappedDispatch => {
    return {
        saveKioskTheme: (params:KioskThemeCreateUpdateRequestParameters)=>dispatch(createUpdateKioskTheme(params)),
        getKioskTheme:(params:GetKioskThemeRequestParameters)=>dispatch(getKioskTheme(params)),
        loadKioskResoruces:(params:KioskResourceIndexRequestParameters)=>dispatch(getKioskResources(params)),
        createKioskResource: (params:KioskResourceCreateRequestParameters)=>dispatch(createKioskResource(params)),
        deleteKioskResource: (id:number)=>dispatch(deleteKioskResource(id))
    }
};

interface PreviewProps {
    themeSetting:ThemeSetting
}

const Preview = decorator(
    class extends React.PureComponent<PreviewProps & WithStyles<typeof styles>, never> {
        render() {
            const { classes } = this.props;
            return (
                // <Grid container>
                //     <Grid md={2} item></Grid>
                //     <Grid md={8} item>
                // <Hidden mdDown>
                    <ThemePreview classes={{
                        PreviewBox: classes.preview
                    }} theme={this.props.themeSetting} />
                // </Hidden>
                //     </Grid>
                //     <Grid md={2} item></Grid>
                // </Grid>
            )
        }
    }
);

interface BackgroundTabProps {
    setting:ThemeBackground
    preview:React.ReactNode
    resourceCreatingUpdate:boolean
    resources:KioskResource[]
    changeBackgroundType:(type:BackgroundType)=>void
    uploadImageResources: (type:KioskResourceType.BackgroundImage|KioskResourceType.LogoImage,files:File[]) => void
    deleteKioskResource: (id:number)=>void
    changeBackground:(background: ThemeBackground)=>void
}

const BackgroundTab = decorator(
    class extends React.PureComponent<BackgroundTabProps & StyleProps, never> {
        constructor(props:BackgroundTabProps & StyleProps) {
            super(props);
            this.dropAccepted = this.dropAccepted.bind(this);
            this.backgroundTypeChanged = this.backgroundTypeChanged.bind(this);
            this.deleteResource = this.deleteResource.bind(this);
        }
        protected dropAccepted(file:FileWithPreview[]) {
            const { uploadImageResources = () => {} } = this.props;
            uploadImageResources(KioskResourceType.BackgroundImage, file);
        }

        protected deleteResource(data:ImageResource) {
            const { deleteKioskResource = ()=>{} } = this.props;
            deleteKioskResource(this.props.resources.find(res=>res.data.upload_rel===data.upload_rel).id)
        }

        protected backgroundTypeChanged(e:React.ChangeEvent<HTMLSelectElement>) {
            const { changeBackgroundType = ()=>{} } = this.props;
            changeBackgroundType(e.target.value as BackgroundType);
        }

        render() {
            let { classes, changeBackground = ()=>{}, preview, setting:backgroundSetting } = this.props;
            preview = (
                <div className={classes.backgroundPreviewContainer}>
                    {preview}
                </div>
            );
            return (
                <div className={classes.tabContent}>
                    <div className={classes.tabContentHeader}>
                        <Typography variant={'h6'} className={classes.tabContentTitle}>Kiosk Background</Typography>
                        <Paper elevation={5}>
                            <Select value={backgroundSetting.type} 
                                onChange={this.backgroundTypeChanged}>
                                <MenuItem value={BackgroundType.image}>Photo/Image</MenuItem>
                                <MenuItem value={BackgroundType.solidColor}>Solid Color</MenuItem>
                                <MenuItem value={BackgroundType.gradientColor}>Gradient Color</MenuItem>
                            </Select>
                        </Paper>
                    </div>
                    {backgroundSetting.type === BackgroundType.image && (
                        <React.Fragment>
                            <div className={classes.imagesContainer}>
                                {this.props.resources.map(imageRes=>(
                                    <SelectableImage key={imageRes.id} classes={{
                                        image: classes.selectableImageImg
                                    }} 
                                    selected={imageRes.data.upload_rel === (backgroundSetting.value as ImageBackground).file.upload_rel}
                                    identifier={imageRes.data}
                                    onDelete={this.deleteResource}
                                    onSelection={(data:ImageResource)=>{
                                        changeBackground({
                                            type: BackgroundType.image,
                                            value: {
                                                file: {
                                                    upload_rel: data.upload_rel,
                                                    full_url: data.full_url
                                                }
                                            }
                                        })
                                    }} imageProps={{
                                        src: imageRes.data.full_url
                                    }} />
                                ))}
                            </div>
                            <br />
                            <Divider />
                            <br />
                            <br />
                            <Grid container>
                                <Grid item md={4}>
                                    <div className={classes.uploadSection}>
                                        <Typography variant={'h6'}>Upload New Image</Typography>
                                        <FileDropzone disabled={this.props.resourceCreatingUpdate} onDropAccepted={this.dropAccepted} classes={{
                                            root: this.props.classes.dropzone
                                        }} />
                                    </div>
                                </Grid>
                                <Grid item md={8}>
                                    {preview}
                                </Grid>
                            </Grid>
                        </React.Fragment>
                    )}
                    {backgroundSetting.type === BackgroundType.solidColor && (
                        <Grid container>
                            <Grid item md={4}>
                                <SolidColorPicker onChange={(color)=>{
                                    changeBackground({
                                        type: BackgroundType.solidColor,
                                        value: color.rgb
                                    })
                                }} color={backgroundSetting.value} />
                            </Grid>
                            <Grid item md={8}>
                                {preview}
                            </Grid>
                        </Grid>
                    )}
                    {backgroundSetting.type === BackgroundType.gradientColor && (
                        <Grid container>
                            <Grid item md={4}>
                                <GradientColorPicker color={backgroundSetting.value} onChange={(color)=>{
                                    changeBackground({
                                        type: BackgroundType.gradientColor,
                                        value: color
                                    })
                                }} />
                            </Grid>
                            <Grid item md={8}>
                                {preview}
                            </Grid>
                        </Grid>
                    )}
                </div>
            );
        }
    }
)

interface LogoTabProps {
    setting:ThemeLogo
    preview:React.ReactNode
    resourceCreatingUpdate:boolean
    resources:KioskResource[]
    uploadImageResources: (type:KioskResourceType.BackgroundImage|KioskResourceType.LogoImage,files:File[]) => void
    deleteKioskResource: (id:number)=>void
    changeLogo:(logo: ThemeLogo)=>void
}

const LogoTab = decorator(
    class extends React.PureComponent<LogoTabProps & StyleProps, never> {
        constructor(props:LogoTabProps & StyleProps) {
            super(props);
            this.logoSelected = this.logoSelected.bind(this);
            this.deleteResource = this.deleteResource.bind(this);
            this.dropAccepted = this.dropAccepted.bind(this);
        }
        
        protected logoSelected(data:ImageResource) {
            const { changeLogo = () => {}} = this.props;
            changeLogo({
                file: {
                    upload_rel: data.upload_rel,
                    full_url: data.full_url
                }
            })
        }

        protected dropAccepted(file:FileWithPreview[]) {
            const { uploadImageResources = () => {} } = this.props;
            uploadImageResources(KioskResourceType.LogoImage, file);
        }

        protected deleteResource(data:ImageResource) {
            const { deleteKioskResource = ()=>{} } = this.props;
            deleteKioskResource(this.props.resources.find(res=>res.data.upload_rel===data.upload_rel).id)
        }

        render() {
            let { classes, resourceCreatingUpdate, preview, setting:logoSetting } = this.props;
            
            preview = (
                <div className={classes.backgroundPreviewContainer}>
                    {preview}
                </div>
            );
            return (
                <div className={classes.tabContent}>
                    <div className={classes.tabContentHeader}>
                        <Typography variant={'h6'} className={classes.tabContentTitle}>Kiosk Logo</Typography>
                    </div>
                    <React.Fragment>
                        <div className={classes.imagesContainer}>
                            {this.props.resources.map(imageRes=>(
                                <SelectableImage key={imageRes.id} classes={{
                                    image: classes.selectableImageImg
                                }} 
                                selected={imageRes.data.upload_rel === logoSetting.file.upload_rel}
                                identifier={imageRes.data} 
                                onDelete={this.deleteResource} 
                                onSelection={this.logoSelected} imageProps={{
                                    src: imageRes.data.full_url
                                }} />
                            ))}
                        </div>
                        <br />
                        <Divider />
                        <br />
                        <br />
                        <Grid container>
                            <Grid item md={4}>
                                <div className={classes.uploadSection}>
                                    <Typography variant={'h6'}>Upload New Image</Typography>
                                    <FileDropzone disabled={resourceCreatingUpdate} onDropAccepted={this.dropAccepted} classes={{
                                        root: this.props.classes.dropzone
                                    }} />
                                </div>
                            </Grid>
                            <Grid item md={8}>
                                {preview}
                            </Grid>
                        </Grid>
                    </React.Fragment>
                </div>
            );
        }
    }
)

interface FontTabProps {
    setting:FontWithVariants
    preview:React.ReactNode
    changeFont:(font: FontWithVariants)=>void
}

const FontTab = decorator(
    class extends React.PureComponent<FontTabProps & StyleProps, never>{
        constructor(props:FontTabProps & StyleProps) {
            super(props);
            this.fontChanged = this.fontChanged.bind(this);
        }

        protected fontChanged(font:FontWithVariants) {
            const { changeFont = ()=>{} } = this.props;
            changeFont(font);
        }

        render() {
            let { classes, preview, setting:fontSetting } = this.props;
            preview = (
                <div className={classes.backgroundPreviewContainer}>
                    {preview}
                </div>
            );

            return (
                <div className={classes.tabContent}>
                    <div className={classes.tabContentHeader}>
                        <Typography variant={'h6'} className={classes.tabContentTitle}>Kiosk Font</Typography>
                    </div>
                    <Grid container>
                        <Grid md={4} item>
                            <FontPickerWithVariants font={fontSetting} onChange={this.fontChanged} api_key={SiteConfig.googleFontApiKey}  />
                        </Grid>
                        <Grid md={8} item>
                            {preview}
                        </Grid>
                    </Grid>
                </div>
            );
        }
    }
);

interface ButtonsTabProps {
    setting:ButtonSetting
    preview:React.ReactNode
    changeButtonSetting:(config:ButtonSetting)=>void
}

const ButtonTab = decorator(
    class extends React.PureComponent<ButtonsTabProps & StyleProps, never>{
        render() {
            let { preview, changeButtonSetting = ()=>{}, classes, setting:buttonSetting } = this.props;
            preview = (
                <div className={classes.backgroundPreviewContainer}>
                    {preview}
                </div>
            );

            return (
                <div className={classes.tabContent}>
                    <div className={classes.tabContentHeader}>
                        <Typography variant={'h6'} className={classes.tabContentTitle}>Kiosk Buttons</Typography>
                    </div>
                    <Grid container>
                        <Grid md={4} item>
                            <ButtonSpecControl
                                buttonSpec={buttonSetting.primary}
                                changeButtonSetting={(setting)=>changeButtonSetting({
                                    accept: {
                                        ...buttonSetting.accept,
                                        shape: setting.shape
                                    },
                                    secondary: {
                                        ...buttonSetting.secondary,
                                        shape: setting.shape
                                    },
                                    cancel: {
                                        ...buttonSetting.cancel,
                                        shape: setting.shape
                                    },
                                    primary: setting
                                })}
                            />
                        </Grid>
                        <Grid md={8} item>
                            {/* {preview} */}
                        </Grid>
                    </Grid>
                </div>
            );
        }
    }
);

interface ButtonSpecProps {
    buttonSpec:ButtonSpec
    changeButtonSetting:(buttonSpec:ButtonSpec)=>void
}

const ButtonSpecControl = decorator(
    class extends React.PureComponent<ButtonSpecProps & StyleProps> {
        render() {
            const { classes, buttonSpec, changeButtonSetting } = this.props;
            const shapeVariants = Object.keys(ButtonShape).map(key=>ButtonShape[key]);
            return (
                <React.Fragment>
                    <div className={classes.buttonShapesContainer}>        
                        <Typography variant={'h6'}>Button Shape</Typography>
                        <Grid container>
                            {shapeVariants.map(variant=>(
                                <Grid key={variant} onClick={()=>changeButtonSetting({
                                    ...buttonSpec,
                                    shape: variant
                                })} item sm={4} xs={6} className={classNames(classes.buttonItem, {
                                    [classes.selected]: buttonSpec.shape===variant
                                })}>
                                    <ShapedButton shape={variant} background={{
                                        color: '#fff'
                                    }} border={{
                                        color: '#000',
                                        width: '5px'
                                    }} />
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                    <Grid container>
                        <Grid item sm={6} xs={12}>
                            <Typography variant={'h5'} align={'center'}>Text Color</Typography>
                            <div style={{display:'flex',margin: '10px',justifyContent: 'center'}}>
                                <SolidColorPicker  onChange={(color)=>{
                                    changeButtonSetting({
                                        ...buttonSpec,
                                        color: color.rgb
                                    })
                                }} color={buttonSpec.color} />
                            </div>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <Typography variant={'h5'} align={'center'}>Background Color</Typography>
                            <div style={{display:'flex',margin: '10px',justifyContent: 'center'}}>
                                <SolidColorPicker onChange={(color)=>{
                                    changeButtonSetting({
                                        ...buttonSpec,
                                        background: color.rgb
                                    })
                                }} color={buttonSpec.background} />
                            </div>
                        </Grid>
                    </Grid>
                </React.Fragment>
            )
        }
    }
);

export default withRouter(
    connect(mapStateToProps,mapDispatchToProps)(
        UseBreadcrumbs (
            decorator (
                ThemingRoot
            )
        )
    )
);