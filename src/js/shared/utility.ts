import './rollbar'
import { toNumber as _ToNumber } from 'lodash-es';
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

export function randomString(length: number, chars: string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

export function base64toBlob(b64Data: string, contentType = '', sliceSize: number = 512): Blob {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

export function toNumber(a: any) {
    if (a !== null && a !== undefined && !isNaN(a)) {
        return _ToNumber(a);
    } else {
        return null;
    }
}

export function filePreviewUrl(file:File) {
    const promise = new Promise<{
        preview_url: string,
        type:string
    }>((resolve)=>{
        let reader = new FileReader();

        reader.onload = (e:any) => {
            resolve({
                preview_url: e.target.result,
                type: file.type
            });
        }
    
        reader.readAsDataURL(file);
    });
    return promise;
}