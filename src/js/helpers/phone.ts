import { parsePhoneNumber as _parsePhoneNumber } from 'react-phone-number-input/libphonenumber';
import { isValidPhoneNumber } from 'react-phone-number-input';

export interface PhoneNumberParseResult {
    formatted?: string
    persistable?: string
    original?: string
    isValid: boolean
}

export function phoneNumberValid(number:string):boolean {
    if(number){
        return isValidPhoneNumber(number);
    }
    return false;
}

export function parsePhoneNumber(number: string): PhoneNumberParseResult {
    let res: PhoneNumberParseResult = {
        isValid: false,
        original: number
    }
    try {
        const parsed = _parsePhoneNumber(number, 'US');
        res.formatted = parsed.formatInternational();
        res.persistable = parsed.number;
        res.isValid = parsed.isValid();
    } catch (e) {
    }
    return res;
}

export function formatPhoneNumber(number: string) {
    const re = parsePhoneNumber(number);
    return re.isValid ? re.formatted : re.original;
}