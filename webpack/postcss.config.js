module.exports = ({ file, options, env }) => {
    const config = {
        //parser: 'sugarss',
        plugins: {
            //'postcss-import': {},     //No need with sass
            'postcss-cssnext': {},      //Already have autoprefixer

        }
    };

    if(options.minimize) {
         config.plugins.cssnano = {};
    }
    return config;
};