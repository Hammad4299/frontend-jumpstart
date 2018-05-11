import path from 'path';

const a = {
    public: 'https://localhost:9000/',
    contentOutput: path.resolve('dist'),
    font: 'fonts',
    images: 'images',
    src: path.resolve('src'),
    clean: [
         'dist'
    ],
    copy: []
};

a.copy = [
    {to: path.resolve(a.contentOutput,'images'), from: path.resolve(a.src,'images')}
];

export default a;