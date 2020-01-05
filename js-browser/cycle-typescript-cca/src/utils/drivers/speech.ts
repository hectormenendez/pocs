import { Driver, Sink, Source } from '../types/driver-speech';

export default function Driver(): Driver {
    return function speechDriver(stream: Sink): Source {
        stream.addListener({
            next(value: string): void {
                if (!window.speechSynthesis) {
                    return undefined;
                }
                const utterance = new SpeechSynthesisUtterance(value);
                window.speechSynthesis.speak(utterance);
            }
        });
    };
}
