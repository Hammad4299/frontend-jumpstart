import React from 'react';
import { DateRangePickerProps, DateRange as Daterange, DateRangePicker, DateRangePickerClassKey } from './DateRangePicker';
import moment from 'moment';
import { StandardProps } from '@material-ui/core';
import timeHelper from 'src/js/helpers/TimeHelper';

interface DateRange {
    startDate:number
    endDate:number
}

export interface UnixDateRangePickerProps extends StandardProps<DateRangePickerProps, DateRangePickerClassKey, 'range'|'onChange'|'onApply'> {
    range:DateRange
    onChange?:(range:DateRange)=>void
    onApply?:(range:DateRange)=>void
}

class Component extends React.PureComponent<UnixDateRangePickerProps> {
    constructor(props:UnixDateRangePickerProps) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onApply = this.onApply.bind(this);
    }

    protected toDateRange(range:Daterange):DateRange {
        const end = parseInt(moment(range.endDate).endOf('day').format('X'));
        const start = parseInt(moment(range.startDate).startOf('day').format('X'));
        return {
            endDate: end,
            startDate: start
        };
    }
    
    protected onApply(a:Daterange) {
        const { onApply = ()=>{} } = this.props;
        onApply(this.toDateRange(a));
    }

    protected onChange(a:Daterange) {
        const { onChange = ()=>{} } = this.props;
        onChange(this.toDateRange(a));
    }
    
    render() {
        const startDate = timeHelper.convertUtcToUserTime(this.props.range.startDate.toString(),'X').toDate();
        const endDate = timeHelper.convertUtcToUserTime(this.props.range.endDate.toString(),'X').toDate();
        return (
            <DateRangePicker
                range={{
                    startDate: startDate,
                    endDate: endDate
                }}
                onChange={this.onChange}
                onApply={this.onApply}
            />
        );
    }
}

export const UnixDateRangePicker = Component;
export default UnixDateRangePicker;