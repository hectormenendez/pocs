import $ from 'xstream';
import Validate from '@gik/validate';

export default function Model({ props$, intent }){

    // State sinks is based upon props stream
    const State = props$.debug(props => Validate(props,{
        title:{ type:String, required:true },
        items:items => items.map(item => Validate(item, {
            href:{ type:String, required:true },
            title:{ type:String, required:true },
        }))
    }))

    return { State };
}
