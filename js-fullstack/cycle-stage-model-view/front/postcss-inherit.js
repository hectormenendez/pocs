const UTIL = require('util');
const PostCss = require('postcss');
const SelectorParser = require('postcss-selector-parser');

// Recommended to be the last plugin.
module.exports = PostCss.plugin('postcss-inherit', options => root => {

    options = options? options : { remove: false };

    // Traverse the global rules and create an array containing them.
    // The @inherit will look here for replacements.
    const globals = [];
    root.walkRules(':global', global => {
        global.walkRules(rule => {
            const decls = [];
            rule.walkDecls(decl => decls.push(decl));
            rule.selector
                .split(',')
                .forEach(selector => globals.push(Object.assign({}, rule, {selector})));
        });
        // TODO: Befor publishing define wether these rules should be deleted or not.
        global.remove();
    });

    const inherits = [];
    root.walkAtRules('inherit', rule => inherits.push(rule));
    inherits.forEach(rule => {
        const cont = rule.parent;

        // If previous declarations found, prepend them in a clone of this rule.
        const prev = cont.nodes.filter(node => cont.index(node) < cont.index(rule));
        if (prev.length) {
            cont.parent.insertBefore(cont, cont.clone({ nodes: prev }));
            prev.forEach(node => node.remove());
        }

        // If posterior declarations found, append them in a clone of this rule.
        const post = cont.nodes.filter(node => cont.index(node) > cont.index(rule));
        if (post.length) {
            cont.parent.insertAfter(cont, cont.clone({ nodes: post }));
            post.forEach(node => node.remove());
        }

        // get the target rules to inherit from.
        const params = rule.params
            // make sure the parameters don't contain unneeded spaces
            .split(',')
            .map(param => param.trim())
            .reverse()
            // find exact matches
            .map(param => globals.filter(global => global.selector == param))
            .reduce((acc, cur) => acc.concat(cur), [])
            // iterate declarations and insert them after the AtRule
            .map(node => node.nodes)
            .reduce((acc, cur) => acc.concat(cur), [])
            .map(decl => cont.append(decl))

        // if an inherit was actually performed, delete the AtRule
        if (params.length) rule.remove();

    });
    // if (globals.length) process.exit(0);
});

function inspect(...args){
    args.push({
        // show non-enumerables
        showHidden: false,
        // The number of times to recurse in properties (null = infinity)
        depth: 1,
        // Style ouput with ANSI Color codes
        colors: true,
        // Max number of array elements to show (null = infinity)
        maxArrayLength: null,
        // The lenggth in which an object keys are split across multiple lines
        breakLength: 1,
    });
    process.stdout.write("\n\n" + UTIL.inspect(...args) + "\n\n");
}
