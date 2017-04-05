export default function Stage(sources){


    const filter$ = sources.DOM
        .select('input')
        .events('keyup')
        .map(e => {
            const value = e.target.value;
            const name = e.target.getAttribute('name');
            return { value, name };
        });

    const intent = {};
    intent.filter$ = filter$.filter(({value}) => value.length);
    intent.reset$ = filter$.filter(({value}) => !value.length);

    const feather = {};

    // Fetch initial logs when starting
    feather.init$ = sources.Feathers
        .select({ type:'local', service:'logs', method:'find' })
        .map(response => response.data);

    // Everytime a log is created update it.
    feather.created$ = sources.Feathers
        .select({ type:'socket', service:'logs', method:'created' })
        .map(data => [data])

    return { feather, intent }
}
