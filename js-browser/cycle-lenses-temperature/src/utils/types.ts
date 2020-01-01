import { TypeSource as TypeSourceDOM, TypeSink as TypeSinkDOM } from './drivers/dom';
import { TypeSource as TypeSourceSpeech, TypeSink as TypeSinkSpeech } from './drivers/speech';
import { TypeSource as TypeSourceRouter, TypeSink as TypeSinkRouter } from './drivers/router';
import { TypeSource as TypeSourceState, TypeSink as TypeSinkState } from './drivers/state';
// import { TypeSource as TypeSourceHistory, TypeSink as TypeSinkHistory, } from './drivers/history';

/**
 * @param I An interface containing a `State`
 * @note The {history} property was commented out, since the {router} Driver hides it.
 */
export interface TypeSources<I> {
    DOM: TypeSourceDOM,
    router: TypeSourceRouter,
    // history?: TypeSourceHistory,
    speech: TypeSourceSpeech,
    state: TypeSourceState<I>,
}

/**
 * @param I An interface containing a `State`
 * @note The {history} property was commented out, since the {router} Driver hides it.
 */
export interface TypeSinks<I> {
    DOM: TypeSinkDOM,
    router?: TypeSinkRouter,
    // history?: TypeSinkHistory,
    speech?: TypeSinkSpeech,
    state?: TypeSinkState<I>,
}

/**
 * @param I An interface containing a `State`
 */
export type TypeComponent<I> = (sources: TypeSources<I>) => TypeSinks<I>;
