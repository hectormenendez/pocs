module.exports = [
    {
        plugin : require('postcss-import'),
        opts   : {},
    },
    {
        plugin : require('postcss-cssnext') ,
        opts   : {
            browsers: ['last 2 versions', '> 5%']
        },
    },
]
