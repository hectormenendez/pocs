const UTIL = require('util');
const PostCss = require('postcss');
const Parser = require('postcss-selector-parser');

const parser = Parser();

module.exports = PostCss.plugin('postcss-inherit', options => root => {

    options = options || {};

    let nodes = [];

    // Traverse and find target classes found inside global scope
    root.walkRules(':global', rule => {
        nodes = nodes.concat(rule.nodes);
        rule.remove();
    });

    // Prepare nodes for traversing
    nodes = nodes
        // eliminate unneeded props
        .map(({ type, selector, nodes }) => ({ type, selector, nodes }))
        .filter(node => node.nodes)
        .map(rule => parser
            // make a stream of selectors
            .process(rule.selector, {lossless:false}).res.nodes[0].nodes
            // make sure every pseudo-selector (except :not) stays with the selector
            .reduce((acc, cur, i) => {
                let name = cur.toString();
                if (cur.type == 'pseudo' && name.slice(0, 4) !== ':not' && i > 0){
                    cur = acc[i-1];
                    acc.splice(i-1, 1);
                    cur.value += name;
                }
                return acc.concat(cur);
            }, [])
            .map(selector => ({
                selector: {
                    type: selector.type,
                    value: selector.toString()
                },
                rule: {
                    type: rule.type,
                    nodes: rule.nodes,
                },
            }))
        )
        .reduce((acc, cur) => acc.concat(cur), [])

    // these are the reference objects that will be used for inheritance
    const targets = nodes
        .filter(node => ['class', 'pseudo'].indexOf(node.selector.type) !== -1)
        .map(({ selector, rule }) => ({
            type: rule.type,
            selector: selector.value,
            nodes: rule.nodes
        }))

    // Traverse :local rules in search of @inherit
    root.walkAtRules('inherit', rule => {
        const parent = rule.parent;
        let selector = parent.selector.trim();
        if (selector.slice(0,6) !== ':local')
            throw new Error('@inherits only allowed inside :local rules.');
        // get the selector to be replaced
        selector = selector
            .slice(6)
            .trim()
            .replace(/^\(([^\)]+)\)/, "$1");
        // Store the params sent by the user, so we can iterate later.
        const params = rule.params.split(/\s+/);
        // remove the rule (so we can grab only the nodes without it)
        rule.remove();
        const nodes = parent.nodes;
        // iterate params (targets) and add new nodes.
        const x = params
            .map(param => {
                const rx = new RegExp("^(:not\(\."+param+"\)|\."+param+")$");
                return targets
                    // Finds the target matching either :not(.param) or .param
                    .filter(target => rx.exec(target.selector))
                    // replace the original param with the correspongin selector
                    // (prepending :local to maintain scope)
                    .map(target => Object.assign({}, target, {
                        selector: target.selector.replace(rx, `:local ${selector} `)
                    }))
                    .forEach(target => {
                        // Append original declarations.
                        nodes.forEach(node => target.nodes.push(node));
                        root.append(target);
                    })
            })
        parent.remove();
    });
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
