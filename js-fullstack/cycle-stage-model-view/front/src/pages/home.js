import $ from 'xstream';
import Buffer from 'xstream/extra/buffer';
import { css as Css } from 'emotion';
import { html as Html } from 'snabbdom-jsx';

import Routes from '../routes';
import ComponentLink from '../components/Link';

const Style = Css`
    padding: 1rem;
    margin: 1rem;
    border: 1px solid #ccc;
    background-color: #eee;
    ul {
        margin:0;
        padding: 0;
        display: flex;
        list-style: none;
        justify-content: space-around;
    }
    li, a {
        display:block
        &:hover {
            background: red;
            text-decoration: underline;
        }
    }
    a {
        text-decoration: none;
    }
`;

const Stage = (sources) => ({
    state: {
        routes: Object.keys(Routes).map((id) => ({ id, ...Routes[id] }))
    },
    getComponentLink: (props) => ComponentLink({ ...sources, props: $.of(props) }),
    sinks: {
        // TODO: Didn't find a way to set this from the component itseld, tried for hours.
        Router: sources.DOM
            .select('li')
            .events('click')
            .map((e) => {
                e.preventDefault();
                return e.target.getAttribute('href');
            }),
    }
})

function Model(staged){
    return $
        .from(staged.state.routes)
        .map(({ path, title }) => staged.getComponentLink({ path, title }).DOM)
        .flatten()
        .compose(Buffer($.never())) // toArray equivalent
        .map((links) => ({ links }))
}

function View(state) {
    const { links } = state;
    return (
        <section className={Style}>
            <ul>
                {links.map((link) => <li>{link}</li>)}
            </ul>
        </section>
    )
};


export default { Stage, Model, View };