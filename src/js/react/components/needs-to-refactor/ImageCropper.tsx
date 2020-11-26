import React, { RefObject } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css"; // see installation section above for versions of NPM older than 3.0.0
import { Theme, StandardProps } from "@material-ui/core";
import { withStyles, createStyles } from "@material-ui/styles";
import {
    CropperOptions,
    CropBoxData,
    Data,
    CroppedCanvasOptions
} from "cropperjs";
import { isEqual } from "lodash-es";
import { StyleClassKey } from "typehelper";

const styles = (theme: Theme) => createStyles({});

export type ImageCropperClassKey = StyleClassKey<typeof styles>;

export interface ImageCropperProps
    extends StandardProps<CropperOptions, ImageCropperClassKey> {
    cropBoxData?: CropBoxData;
    style?: React.CSSProperties;
    zoomTo?: number;
    src: string;
    centerCropBox?: boolean;
    onZoomChanged?: (zoom: number) => void;
    cropOutput?: CroppedCanvasOptions;
    outputType: "blob" | "dataUrl" | "both";
    outputMime?: string;
    onCropped?: (data: CropResult) => void;
}

export type CropResult = Data & {
    blob?: Blob;
    dataUrl?: string;
};

const decorator = withStyles(styles);

class Component extends React.PureComponent<ImageCropperProps> {
    protected preData: Data;
    protected dismounted: boolean;
    protected cropperRefObject: RefObject<any> = React.createRef();
    _crop() {
        const { onCropped = () => {} } = this.props;
        const d = this.cropperRef().getData();
        if (!isEqual(this.preData, d)) {
            this.preData = d;
            const res: CropResult = {
                ...d
            };

            const { outputMime, outputType, cropOutput } = this.props;
            const canvas = this.cropperRef().getCroppedCanvas(cropOutput);
            let promise: Promise<CropResult> = Promise.resolve(res);
            if (outputType === "blob" || outputType === "both") {
                promise = promise.then(r => {
                    const p = new Promise<CropResult>(resolve => {
                        canvas.toBlob(blob => {
                            r.blob = blob;
                            resolve(r);
                        }, outputMime);
                    });

                    return p;
                });
            }
            if (outputType === "dataUrl" || outputType === "both") {
                promise = promise.then(r => {
                    r.dataUrl = canvas.toDataURL(outputMime);
                    return r;
                });
            }

            promise.then(r => {
                onCropped(r);
            });
        }
    }

    protected cropperRef(): any {
        return this.cropperRefObject.current;
    }

    render() {
        const {
            classes,
            minContainerHeight = 1,
            minContainerWidth = 1,
            minCanvasHeight = 1,
            minCanvasWidth = 1,
            minCropBoxHeight = 1,
            minCropBoxWidth = 1,
            centerCropBox = false,
            aspectRatio = undefined,
            viewMode = 1,
            rotatable = false,
            scalable = false,
            dragMode = "move",
            zoomTo = 1,
            cropBoxMovable = false,
            cropBoxResizable = false,
            toggleDragModeOnDblclick = false,
            guides = false,
            src,
            onZoomChanged = z => {
                console.log(z);
            },
            ...rest
        } = this.props;

        return (
            <Cropper
                ref={this.cropperRefObject}
                center
                src={src}
                zoomTo={zoomTo}
                aspectRatio={aspectRatio}
                viewMode={viewMode}
                minContainerWidth={minContainerWidth}
                minContainerHeight={minContainerHeight}
                rotatable={rotatable}
                scalable={scalable}
                dragMode={dragMode}
                cropBoxMovable={cropBoxMovable}
                cropBoxResizable={cropBoxResizable}
                toggleDragModeOnDblclick={toggleDragModeOnDblclick}
                guides={guides}
                zoom={e => onZoomChanged(e.detail.ratio)}
                ready={() => {
                    const data = this.props.cropBoxData;
                    if (centerCropBox) {
                        const spec = this.cropperRef().getContainerData();
                        data.left = (spec.width - data.width) / 2;
                        data.top = (spec.height - data.height) / 2;
                    }
                    this.cropperRef().setCropBoxData(data);
                }}
                crop={this._crop.bind(this)}
                {...rest}
            />
        );
    }
}

export const ImageCropper = decorator(Component);
export default ImageCropper;
