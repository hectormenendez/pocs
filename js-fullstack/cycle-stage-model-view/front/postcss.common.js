module.exports = [
    {
        plugin : require('postcss-import'),
        opts   : {},
    },
    {
        plugin : require('postcss-global-import'),
        opts   : {},
    },
    {
        plugin : require('postcss-cssnext') ,
        opts   : {
            browsers: ['last 2 versions', '> 5%']
        },
    },
    {
        plugin : require('lost'),
        opts   : {},
    },
    {
        plugin : require('./postcss-inherit.js'),
        opts   : { remove: true },
    },
]
