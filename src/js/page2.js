import clicked from 'js/page.js';

if(module.hot){
    module.hot.accept('js/page',()=>{
        clicked();
    });
}