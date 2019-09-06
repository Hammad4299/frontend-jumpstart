import { config } from "../config"
import SiteConfig from "externals/SiteConfig"

export function buildPageTitle(
    title = "Untitled",
    base = `${SiteConfig.appname} - `
) {
    return `${base}${title}`
}

export function randomString(
    length: number,
    chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
) {
    let result = ""
    for (let i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)]
    return result
}

export function base64toBlob(
    b64Data: string,
    contentType = "",
    sliceSize = 512
): Blob {
    const byteCharacters = atob(b64Data)
    const byteArrays = []

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize)

        const byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i)
        }

        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
    }

    const blob = new Blob(byteArrays, { type: contentType })
    return blob
}

export function filePreviewUrl(file: File) {
    const promise = new Promise<{
        preview_url: string
        type: string
    }>(resolve => {
        const reader = new FileReader()

        reader.onload = (e: any) => {
            resolve({
                preview_url: e.target.result,
                type: file.type,
            })
        }

        reader.readAsDataURL(file)
    })
    return promise
}
