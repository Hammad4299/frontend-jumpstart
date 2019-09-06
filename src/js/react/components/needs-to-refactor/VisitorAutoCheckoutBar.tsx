import { Theme, createStyles, withStyles, WithStyles } from "@material-ui/core"
import { StyleClassKeys } from "interfaces/Types"
import Bars from "react-bars"
import React from "react"
import moment from "moment"

const styles = (theme: Theme) => createStyles({})

interface VisitorAutoCheckoutBarProps {
    checkoutAt: number
    max: number
    interval?: number
}

interface State {
    remaining: number
}

type VisitorAutoCheckoutBarClassKeys = StyleClassKeys<typeof styles>

type StyledProps = VisitorAutoCheckoutBarProps &
    WithStyles<VisitorAutoCheckoutBarClassKeys>

const decorator = withStyles(styles)

interface ColorStop {
    color: string
    atleast: number
}

export const VisitorAutoCheckoutBar = decorator(
    class extends React.PureComponent<StyledProps, State> {
        protected interval: NodeJS.Timeout
        constructor(props: StyledProps) {
            super(props)
            this.state = {
                remaining: 0,
            }
        }

        componentDidMount() {
            const { interval = 15000 } = this.props
            this.interval = setInterval(() => {
                this.update()
            }, interval)
            this.update()
        }

        update() {
            this.setState({
                remaining: Math.min(this.getRemaining(), this.props.max),
            })
        }

        componentWillUnmount() {
            clearInterval(this.interval)
        }

        protected getColor() {
            const stops: ColorStop[] = [
                { atleast: 0.8, color: "#ff4546" },
                { atleast: 0.6, color: "#fec446" },
                { atleast: 0.4, color: "#60fe45" },
                { atleast: 0.0, color: "#4680fe" },
            ].sort((p, c) =>
                p.atleast > c.atleast ? -1 : p.atleast === c.atleast ? 0 : 1
            )

            const per = this.state.remaining / this.props.max

            let toRet = null
            stops.forEach(stop => {
                if (toRet === null && per >= stop.atleast) {
                    toRet = stop.color
                }
            })

            return toRet ? toRet : stops[0].color
        }

        protected getRemaining() {
            const now = parseInt(
                moment()
                    .utc()
                    .format("X")
            )
            const remaining = Math.max(0, this.props.checkoutAt - now)
            return remaining
        }

        render() {
            return (
                <Bars
                    data={[
                        {
                            value: this.state.remaining,
                            barColor: this.getColor(),
                            barHeight: 20,
                            barBackgroundColor: "#9e9e9e",
                            maxValue: this.props.max,
                        },
                    ]}
                    verticalSpacing={0}
                />
            )
        }
    }
)
