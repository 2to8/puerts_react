import * as React from 'react'
import * as cs from "csharp"

export namespace Props {
    export type TextProps = { text?: string, font?: any }
    export type ButtonProps = { onClick?: () => void }
    export type GridLayoutGroupProps = { cellSize?: cs.UnityEngine.Vector2 }
    export type HorizontalLayoutGroupProps = { spacing: number }

}

export class GameObject extends React.Component {
    render() {
        return React.createElement("GameObject", this.props);
    }
}