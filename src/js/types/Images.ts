export interface ResponsiveImage {
    [index: string]: any;
    src: string;
    srcSet: string;
}

export interface ImageSpec {
    [index: string]: string | ResponsiveImage;
    webp?: string | ResponsiveImage;
    compressed?: string | ResponsiveImage;
    fallback?: string | ResponsiveImage;
}

export function normalizeImage(val: string | ResponsiveImage): ResponsiveImage {
    let spec: ResponsiveImage = {
        srcSet: null,
        src: null
    };

    if (typeof val === "string") {
        spec.src = val;
    } else {
        spec = val;
    }
    return spec;
}
