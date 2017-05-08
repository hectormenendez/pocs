import Validate from '@gik/validate';
import SMV from './index';

export function Component(options){
    const {sources,path} = Validate(options, {
        sources:{ type:Object, required:true },
        path:{ type:String, required:true }
    });
    return ComponentSMV.bind(this, path, sources);
}

export function ComponentSMV(path, sources, Props){
    // Get the SMV function and append the Props source.
    const component$ = SMV(path).map(smv => smv({ ...sources, Props }));
    // Return an object with dynaminc property getter that returns sink streams.
    return new Proxy({}, {
        get(target, key) {
            return component$
                .map(component => component[key])
                .filter(Boolean)
                .flatten();
        }
    })
}

export default Component;
