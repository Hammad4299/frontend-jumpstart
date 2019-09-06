import React from "react"
import Webcam from "react-webcam"
import "webrtc-adapter"
import { base64toBlob } from "helpers"

export type ImageCapturerProps = {}

interface State {
    width: number
    height: number
}

/**
 * To be used with React.ref
 */
export class ImageCapturer extends React.PureComponent<
    ImageCapturerProps,
    State
> {
    protected webcam: Webcam
    protected imageFormat: "image/png" = "image/png"
    constructor(props: ImageCapturerProps) {
        super(props)
        this.state = {
            height: null,
            width: null,
        }
    }
    public takePictureBase64(): string {
        return this.webcam.getScreenshot()
    }
    public takePictureBlob(): Blob {
        return base64toBlob(this.takePictureBase64(), this.imageFormat)
    }
    componentDidMount() {
        navigator.mediaDevices
            .getUserMedia({
                video: {
                    height: {
                        min: 300,
                        max: 850,
                        ideal: 600,
                    },
                    width: {
                        min: 300,
                        max: 850,
                        ideal: 800,
                    },
                },
            })
            .then(stream => {
                let found = false
                stream.getVideoTracks().forEach(track => {
                    if (!found) {
                        found = true
                        this.setState({
                            height: track.getSettings().height,
                            width: track.getSettings().width,
                        })
                    }
                    track.stop()
                })
            })
    }
    render() {
        const videoConstraints = {
            width: { exact: this.state.width },
            height: { exact: this.state.height },
        }

        return (
            this.state.width && (
                <Webcam
                    width={this.state.width}
                    height={this.state.height}
                    audio={false}
                    ref={webcam => (this.webcam = webcam)}
                    screenshotFormat={this.imageFormat}
                    {...{
                        videoConstraints,
                    }}
                />
            )
        )
    }
}

export default ImageCapturer
