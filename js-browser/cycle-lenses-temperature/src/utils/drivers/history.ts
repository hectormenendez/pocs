import { Driver as TypeDriverCycle } from '@cycle/run';
import {
    Stream as TypeStream,
    MemoryStream as TypeStreamMemory
} from 'xstream';
import {
    makeHistoryDriver as Make,
    Location as TypeLocation,
    HistoryInput as TypeHistory
} from '@cycle/history';


/** The signature for the `Source` coming from the `History Driver` */
export type TypeSource = TypeStreamMemory<TypeLocation>;

/** The signature for a value inside a `Sink` from the `History Driver` */
export type TypeValue = TypeHistory;

/** The signature for a `Sink` returning from the `History Driver` */
export type TypeSink = TypeStream<TypeValue>;

/** The `History Driver` signature. */
export type TypeDriver = TypeDriverCycle<TypeSink, TypeSource>;

export default function Driver(): TypeDriver {
    return Make();
}
