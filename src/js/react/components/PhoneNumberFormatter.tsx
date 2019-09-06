import React from "react"
import { formatPhoneNumber } from "../../helpers"

interface Props {
    children: string
}

export function PhoneNumberFormatter(props: Props) {
    return <React.Fragment>{formatPhoneNumber(props.children)}</React.Fragment>
}

export default PhoneNumberFormatter
