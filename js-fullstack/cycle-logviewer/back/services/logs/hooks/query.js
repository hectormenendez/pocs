export function QueryRegex(){
    return hook => {
        hook.params.query = Object
            // convert it to array
            .keys(hook.params.query)
            .reduce((arr, field) => arr.concat({
                field,
                value:hook.params.query[field],
            }), [])
            // operate
            .map(({field, value}) => {
                // don't do anything if no $search is present
                if (value.$search === undefined) return { field, value };
                // an empty string should signify 'find all'
                if (!value.$search || !value.$search.length) return null;
                const query = value.$search;
                delete value.$search;
                value.$regex = new RegExp(query, 'i');
                return { field, value };
            })
            // filter out unneeded fields
            .filter(Boolean)
            // convert back to object.
            .reduce((object, {field, value}) => ({ ...object, [field]:value }), {});
        return hook;
    }
}
