import Moment from 'moment';

export function DateAssign(options){
    return hook => {
        hook.data = Object.assign({ _date:Date.now() }, hook.data);
        return Promise.resolve(hook);
    }
}

export function DateSort(){
    return hook => {
        hook.params.query.$sort = { _date: -1 };
        return Promise.resolve(hook);
    }
}

export function DateFormat(hooktype){
    const format = date => Moment(date).format('YY-MM-DD hh:mm:ss')
    return hook => {
        if (hooktype == 'find') hook.result.data = hook.result.data
            .map(data => ({ ...data, _date:format(data._date)  }));
        if (hooktype == 'create') hook.result._date = format(hook.result._date);
        return Promise.resolve(hook);
    }
}
