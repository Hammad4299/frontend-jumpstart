import '../../publicpath';
import '@babel/polyfill';
import React from "react";
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import { hot } from "react-hot-loader/root";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import { create } from "jss";
import JssProvider from 'react-jss/lib/JssProvider';
import { createGenerateClassName, jssPreset } from "@material-ui/core";
import theme from '../style/Theme';
import { store } from 'redux-store';
import Root from './root';

// if (process.env.NODE_ENV !== 'production') {
//     const {whyDidYouUpdate} = require('why-did-you-update')
//     whyDidYouUpdate(React)
// }
const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
const App = () => (
    <JssProvider jss={jss} generateClassName={generateClassName}>
        <Provider store={store}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <Root />
                </BrowserRouter>
            </MuiThemeProvider>
        </Provider>
    </JssProvider>
);

ReactDOM.render(<App />, document.getElementById('main-content'));
export default hot(App);