import * as React from "react";
import * as ReactDOM from "react-dom";
interface HelloProps { compiler: string; framework: string; }

const Hello = (props: HelloProps) => <h1>Hellsds ksdkdsds sdl lss kd s sso from {props.compiler} and {props.framework}!</h1>;

ReactDOM.render(
    <Hello compiler="TypeScript" framework="React" />,
    document.getElementById("example")
);