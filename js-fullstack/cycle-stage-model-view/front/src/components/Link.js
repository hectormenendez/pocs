import $ from 'xstream';
import { html as Html } from 'snabbdom-jsx';
import { Handler } from '../helpers/smv';

const Stage = (sources) => ({
    intent: {
        /** Props were changed. @todo Validate props here. */
        props$: sources.props,
    },
});

function Model({ intent }){
    const { props$ } = intent;
    return props$;
}

function View(props) {
    const { path, title } = props;
    return (
        <a href={path}>{title}</a>
    );
};

export default Handler({ Stage, Model, View });
