import React from 'react';
import { createStyles, Theme, withStyles, StandardProps, Stepper, StepButton, StepIcon, StepLabel, Icon, StepConnector } from "@material-ui/core";
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import { BreadcrumbInfo, BreadcrumbType } from 'models/Breadcrumbs';
import { StyleClassKeys } from 'interfaces/Types';
import Step, { StepProps } from '@material-ui/core/Step';
import { Home as HomeIcon } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { ThemeSettingIdentifier } from 'models/ThemeSetting';
import { toRGBAString } from 'shared/Color';
import { lighten, darken } from '@material-ui/core/styles/colorManipulator';
import classNames from 'classnames';
import { StepButtonProps } from '@material-ui/core/StepButton';


const styles = (theme:Theme) => {
    const breadcrumbSetting = theme.custom.kiosk.setting[ThemeSettingIdentifier.setting_general].breadcrumb;
    const activeBreadcrumbSetting = theme.custom.kiosk.setting[ThemeSettingIdentifier.setting_general].activeBreadcrumb;
    
    return createStyles({
        stepIcon: {
            fontSize: '50px',
            ...theme.custom.kiosk.font,
            color: toRGBAString(breadcrumbSetting.background),
            '&$active': {
                color: toRGBAString(activeBreadcrumbSetting.background)
            }
        },
        active: {
            '& $stepIconText': {
                fill: toRGBAString(activeBreadcrumbSetting.color)
            },
            '& $connector':{
                borderColor: toRGBAString(activeBreadcrumbSetting.background),
            }
        },
        stepIconText: {
            fill: toRGBAString(breadcrumbSetting.color),
        },
        connector: {
            borderWidth: '10px',
            borderColor: toRGBAString(breadcrumbSetting.background),
        },
        simpleIcon: {
            fontSize: '40px',
            padding: '5px',
            borderRadius: '50%',
            backgroundColor: toRGBAString(breadcrumbSetting.background),
            color: toRGBAString(breadcrumbSetting.color),
            '&$active': {
                backgroundColor: toRGBAString(activeBreadcrumbSetting.background),
                color: toRGBAString(activeBreadcrumbSetting.color)
            }
        },
        stepperRoot: {
            backgroundColor: 'transparent'
        }
    })
};

interface KioskStepperProps extends StandardProps<{},StyleClassKeys<typeof styles>>{
    breadcrumbs:BreadcrumbInfo[]
}

type StepSpec = {
    route?:string
    content:React.ReactChild
}

function KioskStepper({breadcrumbs, classes}:KioskStepperProps) {
    const steps:StepSpec[] = [
        {
            content:<HomeIcon className={classNames(classes.simpleIcon,{
                [classes.active]:0<breadcrumbs.length
            })} />
        },
        ...([1,2,3,4,5,6,7].map((content)=>({
                content: content
            }))
        )
    ];
    return (
        <Stepper connector={null} activeStep={breadcrumbs.length-1} nonLinear classes={{
            root: classes.stepperRoot
        }}>
            {
                steps.map((stepSpec,index)=>{
                    let extraProps:StepButtonProps = {};
                    if(index < breadcrumbs.length) {
                        extraProps = {
                            component: Link,
                            ...{to: breadcrumbs[index].route}
                        };
                    }
                    return (
                        <React.Fragment key={index}>
                            <Step completed={false}>
                                <StepButton disableRipple icon={''} {...extraProps}>
                                    <StepIcon active={index<breadcrumbs.length} icon={stepSpec.content} classes={{
                                        root: classes.stepIcon,
                                        text: classes.stepIconText,
                                        active: classes.active
                                    }} />
                                </StepButton>                                    
                            </Step>
                            <StepConnector style={{
                                marginLeft: index===0 ? '-2px' : '0px'
                            }} active={index<breadcrumbs.length-1 || index===steps.length} classes={{
                                line: classes.connector,
                                active: classes.active
                            }} />
                        </React.Fragment>
                    )
                })
            }
        </Stepper>
    )
}

export default withStyles(styles)(KioskStepper);