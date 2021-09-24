import "../../publicpath";
import { store } from "../../redux-store";
import theme from "../style/Theme";
import Root from "./root";
import { printMe } from "./sample/index";
import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { createGenerateClassName, StylesProvider } from "@material-ui/styles";
import React from "react";
import ReactDOM from "react-dom";
import { hot } from "react-hot-loader/root";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

// if (process.env.NODE_ENV !== 'production') {
//     const {whyDidYouUpdate} = require('why-did-you-update')
//     whyDidYouUpdate(React)
// }
const generateClassName = createGenerateClassName();
// const jss = create(jssPreset());
// printMe();
export const App = () => (
    <StylesProvider generateClassName={generateClassName}>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <Root />
                </BrowserRouter>
            </ThemeProvider>
        </Provider>
    </StylesProvider>
);

// console.log(module.hot);
// if (module.hot) {
//     module.hot.accept("./sample/index.tsx", function () {
//         console.log("Accepting the updated printMe module!");
//         printMe();
//     });
// }

const HotApp = hot(App);
export default HotApp;
ReactDOM.render(<HotApp />, document.getElementById("main-content"));
