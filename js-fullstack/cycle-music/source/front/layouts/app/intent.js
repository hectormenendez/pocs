
export const Intent = DOM => ({

    decrement$: DOM
        .select('.decrement')
        .events('click')
        .mapTo(-1),

    increment$: DOM
        .select('.increment')
        .events('click')
        .mapTo(+1)

});

export default Intent;
