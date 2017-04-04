export default function Stage(sources){

    const feather = {};

    // Fetch initial logs when starting
    feather.init$ = sources.Feathers
        .select({ type:'local', service:'logs', method:'find' })
        .map(response => response.data);

    // Everytime a log is created update it.
    feather.created$ = sources.Feathers
        .select({ type:'socket', service:'logs', method:'created' })

    return { feather }
}
