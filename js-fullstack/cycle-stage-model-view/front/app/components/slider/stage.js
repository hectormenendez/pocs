import Validate from '@gik/validate';
import Debug from 'debug';

export default sources => ({

    debug: Debug('component:slider'),

    prop: Validate(sources.Props, {
        value: { type:Number, required:true },
        label: { type:String },
        min: { type:Number, value:0 },
        max: { type:Number, value:100 },
    }),

    intent: {
        slided$: sources.DOM
            .select('input')
            .events('input')
            .map(e => e.target.value),
    },

})
