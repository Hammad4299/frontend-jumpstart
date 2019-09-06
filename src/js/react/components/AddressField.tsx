import React, { RefObject, useState, useRef, useEffect } from "react"
import { Theme, StandardProps } from "@material-ui/core"
import { createStyles, withStyles, makeStyles } from "@material-ui/styles"
import { InputProps } from "@material-ui/core/Input"
import { defaultTo } from "lodash-es"
import {
    GooglePlaceAutocompleteServiceWrapper,
    extractGooglePlaceComponents,
} from "helpers"
import { StyleClassKey } from "typehelper"
import { AppSelect, SimpleOption } from "components"

const styles = (theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
        },
    })

export type AddressFieldClassKey = StyleClassKey<typeof styles>

const useStyles = makeStyles(styles)

export interface AddressFieldProps
    extends StandardProps<{}, AddressFieldClassKey> {
    value: string
    inputProps?: InputProps
    onChange: (address: AddressAutoComplete) => void
}

export interface AddressAutoComplete {
    street_address: string
    city: string
    state: string
    zipcode: string
    country: string
}

function Component(props: AddressFieldProps) {
    const { onChange } = props
    const [predictions, setPredictions] = useState<
        google.maps.places.AutocompletePrediction[]
    >([])
    const [input, setInput] = useState("")

    const refHolder = useRef(React.createRef<HTMLDivElement>())
    const serviceRef = useRef<GooglePlaceAutocompleteServiceWrapper>(null)

    const useGooglePlaceService = useEffect(() => {
        serviceRef.current = new GooglePlaceAutocompleteServiceWrapper(
            {
                input: "",
                types: ["address"],
            },
            refHolder.current.current
        )
    }, [])

    const classes = useStyles(props)

    const service = serviceRef.current
    const ref = refHolder.current
    const value = defaultTo(props.value, "")

    let options: SimpleOption[] = []
    if (predictions) {
        options = predictions.map(suggestion => ({
            value: suggestion.place_id,
            label: suggestion.description,
        }))
        options.push({
            value: "google",
            label: input,
        })
    }

    const attribution = <span ref={ref}></span>

    return (
        <React.Fragment>
            {attribution}
            <AppSelect
                value={{
                    value,
                    label: value,
                }}
                showDropdownIndicator={false}
                options={options}
                fullWidth
                isOptionDisabled={option => option.value === "google"}
                formatOptionLabel={option => {
                    if (option.value !== "google") {
                        return option.label
                    } else if (option.value === "google") {
                        return (
                            <img
                                src={require("images/powered_by_google.png")}
                            />
                        )
                    }
                }}
                onChange={(value: any) => {
                    if (value.value) {
                        service
                            .getGooglePlaceDetail({
                                placeId: value.value,
                            })
                            .then(resp => {
                                onChange(
                                    extractGooglePlaceComponents(resp.detail)
                                )
                            })
                    }
                }}
                onInputChange={(a, b) => {
                    if (a.length > 0) {
                        setInput(a)
                        service.getGooglePlacePredictions(a).then(resp => {
                            setPredictions(predictions)
                        })
                    }
                }}
            />
        </React.Fragment>
    )
}

Component.defaultProps = {
    onChange: () => {},
    value: "",
}

Component.displayName = "AddressField"
export const AddressField = Component
export default AddressField
