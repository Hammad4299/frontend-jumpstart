import theme from "../style/Theme";
import Root from "./root";
import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { createGenerateClassName, StylesProvider } from "@material-ui/styles";
import React from "react";
import ReactDOM from "react-dom";
import { hot } from "react-hot-loader/root";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "redux-store";

// if (process.env.NODE_ENV !== 'production') {
//     const {whyDidYouUpdate} = require('why-did-you-update')
//     whyDidYouUpdate(React)
// }
const generateClassName = createGenerateClassName();
// const jss = create(jssPreset());
const App = () => (
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

ReactDOM.render(<App />, document.getElementById("main-content"));
export default hot(App);
