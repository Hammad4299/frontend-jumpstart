let path = require('path');

module.exports = function () {
    return {
        public: '/Webpack%20Jumpstart/dist/',
        contentOutput: path.join(__dirname,'dist'),
        font: 'fonts',
        images: 'images',
        src: path.join(__dirname,'src'),
        toCopy: null
    };
}