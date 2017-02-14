module.exports = {
    plugins: {
        'postcss-normalize':{},
        'postcss-import':{},
        'postcss-cssnext':{
            browsers: ['last 2 versions', '> 5%']
        },
        'lost': {}
    }
}
