import { Source as SourceDOM, Sink as SinkDOM } from './driver-dom';
import { Source as SourceRouter, Sink as SinkRouter } from './driver-router';
import { Source as SourceSpeech, Sink as SinkSpeech } from './driver-speech';
import { Source as SourceState, Sink as SinkState } from './driver-state';
import { Source as SourceHistory, Sink as SinkHistory } from './driver-history';

export { Stream } from 'xstream';

/**
 * @param I An interface containing a `State`
 * @note The {history} property was commented out, since the {router} Driver hides it.
 */
export interface Sources<I> {
    DOM: SourceDOM;
    router: SourceRouter;
    history?: SourceHistory;
    speech: SourceSpeech;
    state: SourceState<I>;
}

/**
 * @param I An interface containing a `State`
 * @note The {history} property was commented out, since the {router} Driver hides it.
 */
export interface Sinks<I> {
    DOM: SinkDOM;
    router?: SinkRouter;
    history?: SinkHistory;
    speech?: SinkSpeech;
    state?: SinkState<I>;
}

/**
 * @param I An interface containing a `State`
 */
export type Component<I> = (sources: Sources<I>) => Sinks<I>;
