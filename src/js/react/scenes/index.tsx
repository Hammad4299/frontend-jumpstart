// import '../../publicpath';
// import "core-js/stable";
// import "regenerator-runtime/runtime";
import React from "react";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline } from '@material-ui/core'
import { hot } from "react-hot-loader/root";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import { createGenerateClassName, StylesProvider } from "@material-ui/styles";
import theme from '../style/Theme';
import { store } from '../../redux-store';
import Root from './root';

// if (process.env.NODE_ENV !== 'production') {
//     const {whyDidYouUpdate} = require('why-did-you-update')
//     whyDidYouUpdate(React)
// }
const generateClassName = createGenerateClassName();
// const jss = create(jssPreset());
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

ReactDOM.render(<App />, document.getElementById('main-content'));
export default hot(App);