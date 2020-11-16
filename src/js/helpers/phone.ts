import {
    parsePhoneNumber as _parsePhoneNumber,
    E164Number
} from "libphonenumber-js";
import { isValidPhoneNumber } from "react-phone-number-input";

export interface PhoneNumberParseResult {
    formatted?: string;
    persistable?: E164Number;
    original?: string;
    isValid: boolean;
}

export function phoneNumberValid(number: string): boolean {
    if (number) {
        return isValidPhoneNumber(number);
    }
    return false;
}

export function parsePhoneNumber(number: string): PhoneNumberParseResult {
    const res: PhoneNumberParseResult = {
        isValid: false,
        original: number
    };
    try {
        const parsed = _parsePhoneNumber(number, "BM");
        res.formatted = parsed.formatInternational();
        res.persistable = parsed.number;
        res.isValid = parsed.isValid();
    } catch (e) {
        console.debug(e);
    }
    return res;
}

export function formatPhoneNumber(number: string) {
    const re = parsePhoneNumber(number);
    return re.isValid ? re.formatted : re.original;
}
