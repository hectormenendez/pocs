import { Stream as TypeStream } from 'xstream';
import { Driver as TypeDriverCycle } from '@cycle/run';


/** The signature for the `Source` coming from the `Speech Driver` */
export type TypeSource = void;

/** The signature for a value inside a `Sink` from the `Speech Driver` */
export type TypeValue = string;

/** The signature for a `Sink` returning from the `Speech Driver` */
export type TypeSink = TypeStream<TypeValue>;

/** The `Speech Driver` signature. */
export type TypeDriver = TypeDriverCycle<TypeSink, TypeSource>;

export default function Driver(): TypeDriver {
    return function speechDriver(stream: TypeSink): TypeSource {
        stream.addListener({
            next(value: string): void {
                if (!window.speechSynthesis) {
                    return undefined;
                }
                const utterance = new SpeechSynthesisUtterance(value);
                window.speechSynthesis.speak(utterance);
            }
        });
    }
}
