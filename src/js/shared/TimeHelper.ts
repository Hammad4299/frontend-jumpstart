import {default as moment, Moment} from 'moment';

class TimeHelper{
    private userTimezone:string|null|undefined;
    private dateTimeFormat:string;

    constructor(userTimezone?:string|null|undefined) {
        this.setTimezone(userTimezone);
        this.dateTimeFormat = 'YYYY-MM-DD hh:mm a';
    }

    public setTimezone(userTimezone?:string|null|undefined){
        this.userTimezone = userTimezone;
    }

    public getUserUtcOffset():number {
        let baseOffset = moment().utcOffset();

        if(this.userTimezone){
            baseOffset = parseInt(this.userTimezone)*60;
        }

        return baseOffset;
    }

    public convertUtcToUserTime (utcdateTime:string, parseFormat:string) : Moment {
        return moment.utc(utcdateTime, parseFormat).utcOffset(this.getUserUtcOffset());
    }

    public timestampToLocal(timestamp:number):string {
        return this.convertUtcToUserTime(`${timestamp}`,'X').format(this.dateTimeFormat);
    }

    public userTime():any{
        return moment.utc().utcOffset(this.getUserUtcOffset());
    }

    public static utcTime():any{
        return moment.utc();
    }

    public static convertTimeToDifferentZone(timestring:string, parseFormat:string, currentOffset:number,desiredOffset:number):Moment {
        let localdateTime1 = moment(timestring, parseFormat);
        return localdateTime1.subtract(desiredOffset - currentOffset, 'minutes').utcOffset(desiredOffset);

    }

    public convertLocalToUtc(localdateTime:string, parseFormat:string):Moment {
        let localdateTime1 = moment(localdateTime, parseFormat);
        return TimeHelper.convertTimeToDifferentZone(localdateTime,parseFormat, localdateTime1.utcOffset(), this.getUserUtcOffset()).utcOffset(0);
    }
}

let timeHelper = new TimeHelper();
export default timeHelper;