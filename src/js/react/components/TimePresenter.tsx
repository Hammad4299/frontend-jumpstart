import timeHelper from "src/js/helpers/TimeHelper";
import React from "react";

export interface TimePresenterProps {
    children:string|number,
    variant?:'date'|'time'|'datetime'|'duration'
    parseFormat?:string
    outputFormat?:string
    parseTimezone?:string|number|'utc'
    outputTimezone?:string|number|'user'
}

export function TimePresenter({
    children, 
    outputTimezone = 'user', 
    parseTimezone = 'utc', 
    variant = 'date', 
    parseFormat = 'X', 
    outputFormat = 'MMMM D, YYYY'
}:TimePresenterProps)  {
    return (
        <React.Fragment>
            {timeHelper.convertUtcToUserTime(children.toString(), parseFormat).format(outputFormat)}
        </React.Fragment>
    );
};

export default TimePresenter;