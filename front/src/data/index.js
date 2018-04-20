import React from 'react';

const Context = React.createContext();

// Initial state
const State = {
};

export class Provider extends React.Component {

    state = State;

    render() {
        const value = {
            state: this.state,
        };

        return <Context.Provider value={value}>
            {this.props.children}
        </Context.Provider>;
    }
}

export const { Consumer } = Context;
