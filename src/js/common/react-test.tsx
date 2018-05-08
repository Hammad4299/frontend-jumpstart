import * as React from "react";
import * as ReactDOM from "react-dom";
import {getImageSrc} from "./utils";
interface HelloProps { compiler: string; framework: string; }

const Hello = (props: HelloProps) => <h1>Hellsds ksdkdsds sdl lss kd s sso from {props.compiler} and {props.framework}!</h1>;

const image = require('images/CMSCreativeKingfisher.jpg?size[]=1000&size[]=2000');
console.log(image);
console.log(getImageSrc(image));

ReactDOM.render(
    <Hello compiler="TypeScript" framework="React" />,
    document.getElementById("example")
);