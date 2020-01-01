import { Stream as TypeStream} from 'xstream';
import { makeDOMDriver as Make } from '@cycle/dom';
import { Driver as TypeCycleDriver } from '@cycle/run';
import { DOMSource as TypeDOMSource, VNode as TypeDOMNode } from  '@cycle/dom';

/** The signature for the `Source` coming from the `DOM Driver` */
export type TypeSource = TypeDOMSource;

/** The signature for a value inside a `Sink` from the `DOM Driver` */
export type TypeValue = TypeDOMNode;

/** The signature for a `Sink` returning from the `DOM Driver` */
export type TypeSink = TypeStream<TypeValue>;

/** The `DOM Driver` signature. */
export type TypeDriver = TypeCycleDriver<TypeSink, TypeSource>;

export default function Driver(selector: string): TypeDriver {
    return Make(selector);
}