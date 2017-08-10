let path = require('path');

module.exports = function () {
    return {
        public: 'http://localhost:8080/Testing/dist/',
        contentOutput: path.join(__dirname,'dist'),
        font: 'fonts',
        images: 'images',
        src: path.join(__dirname,'src'),
        toCopy: null
    };
}