import { Stream, MemoryStream } from 'xstream';
import { Driver as DriverCycle } from '@cycle/run';
import { Location, HistoryInput} from '@cycle/history';

/** The signature for the `Source` coming from the `History Driver` */
export type Source = MemoryStream<Location>;

/** The signature for a value inside a `Sink` from the `History Driver` */
export type Value = HistoryInput;

/** The signature for a `Sink` returning from the `History Driver` */
export type Sink = Stream<Value>;

/** The `History Driver` signature. */
export type Driver = DriverCycle<Sink, Source>;