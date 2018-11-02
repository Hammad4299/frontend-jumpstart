import './publicpath';
// import '../page.js';
// import '../common/react-test';

import './styles/global.scss';
import 'js/page.js';
//import * as _ from 'lodash';

let a = null;

import clicked from "js/page";
window.onclick = function () {
    clicked();
};

if(module.hot){
    module.hot.accept('./js/page',()=>{

    });
}