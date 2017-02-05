import $ from 'xstream';

export default intent => {

    const count$ = intent.usersUpdate$
        .map(() => intent.getUserCountStream())
        .flatten()
        .map(data => data.total)
        .startWith(0)
        .debug(x => console.log('» model » count$ »', x));

    const usersCreated$ = intent.usersCreate$
        .filter(name => name.length > 0)
        .map(name => intent.getUserCreateStream({name}))
        .flatten()
        .startWith(null)
        .debug(x => console.log('» model » usersCreated$ »', x));

    return $
        .combine(
            count$,
            usersCreated$
        )
        .map(([count, userCreated]) => ({count, userCreated}))
}
