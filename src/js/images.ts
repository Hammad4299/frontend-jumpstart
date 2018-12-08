import $ from 'jquery';
interface ResponsiveImage {
    [index:string]:any
    src: string
    srcSet: string
}

interface ImageSpec {
    [index:string]:string|ResponsiveImage
    webp?: string|ResponsiveImage
    compressed?: string|ResponsiveImage
    fallback?: string|ResponsiveImage
}

function getVal(val:string|ResponsiveImage):ResponsiveImage {
    let spec:ResponsiveImage = {
        srcSet: null,
        src: null
    };
    
    if(typeof val === 'string') {
        spec.src = val;
    } else {
        spec = val;
    }
    return spec;
}

export function setImagesInPicture(picture:any,image:ImageSpec) {
    const imgSource = picture.find(`[data-format=fallback]`);
    picture.find('source').remove();
    if(imgSource.length) {
        let val = getVal(image.fallback);
        imgSource.attr('src',val.src);
        val = getVal(image.compressed);
        if(val.srcSet){
            imgSource.attr('srcset',val.srcSet);
        }
    }
    
    if(image.webp) {
        const val = getVal(image.webp);
        if(val.srcSet) {
            let min = 0;
            val.images.forEach((img:any,index:number)=>{
                let max = null;
                const minRes = `(min-width: ${min}px)`;
                let maxRes = '';
                if(val.images.length>index+1) {
                    maxRes = `and (max-width: ${img.width-1}px)`;
                    min = img.width;
                }
                $(`<source type="image/webp" media="${minRes} ${maxRes}" srcset="${img.path}" >`).insertBefore(imgSource);
            });
        } else {
            $(`<source type="image/webp" srcset="${val.src}" >`).insertBefore(imgSource);
        }
    }
}



const img = {
    castle: {
        compressed: require('images/castle.png?sizes[]=468&sizes[]=768&sizes[]=992&sizes[]=1368&sizes[]=1920'),
        webp: require('webp-images/castle.png?sizes[]=468&sizes[]=768&sizes[]=992&sizes[]=1368&sizes[]=1920'),
        fallback: require('images/castle.png')
    }
};

type Object<X> = {
    [T in keyof X]: ImageSpec
};

export const images:Object<typeof img> = img;