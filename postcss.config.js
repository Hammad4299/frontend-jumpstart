module.exports = ({ file, options, env }) => ({
    //parser: 'sugarss',
    plugins: {
        //'postcss-import': {},   //No need with css
        'postcss-cssnext': {},      //Already have autoprefixer
        //'cssnano': {}           //Will be handled by CSSOptimizePlugin
    }
});