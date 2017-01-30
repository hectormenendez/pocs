import $ from 'xstream';

export default function({DOM}) {

    const sliderValue$ = DOM
        .select('.slider')
        .events('input')
        .map(e => e.target.value);

    return { sliderValue$ }
}
