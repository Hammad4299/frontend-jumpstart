import React, { useMemo } from "react"
import { uniqueId } from "lodash-es"
import Input, { InputProps } from "@material-ui/core/Input"
import { ButtonBaseProps } from "@material-ui/core/ButtonBase"

export function fileButton<T extends ButtonBaseProps>(
    Component: React.ComponentType<T>
) {
    interface Props {
        onFilesChange?: (files: FileList) => void
        inputProps?: InputProps
    }

    type FileButtonProps = Props & T

    function ModifiedComponent(props: FileButtonProps) {
        const { onFilesChange, inputProps, ...tmp } = props
        const id = useMemo(() => uniqueId("file_inp_hoc"), [])
        const rest = tmp as T

        return (
            <React.Fragment>
                <Input
                    {...inputProps}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        onFilesChange(e.currentTarget.files)
                    }
                    style={{ display: "none" }}
                    type={"file"}
                    id={id}
                />
                <Component {...{ htmlFor: id }} {...rest} component={"label"} />
            </React.Fragment>
        )
    }

    ModifiedComponent.defaultProps = {
        onFilesChange: () => {},
    }
    ModifiedComponent.displayName = "FileButton"
    return ModifiedComponent
}

export default fileButton
