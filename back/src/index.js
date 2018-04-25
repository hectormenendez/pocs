import { $fromInput } from './utils';
import GomodoroCounter$ from './gomodoro-counter';

const prompt = [
    'Select an action:',
    '   [1] Gomodoro counter.',
    '',
].join('\n');

const input$ = $fromInput(prompt)
    .switchMap((input) => {
        switch (input) {
            case '1': return GomodoroCounter$;
            default: throw new Error('Invalid option.');
        }
    });

/* eslint-disable no-console */
input$.subscribe(
    response => console.log('Response:', response),
    (error) => {
        console.error('Error:', error);
        process.exit(1);
    },
    () => {
        console.log('DONE');
        process.exit(0);
    },
);
/* eslint-enable no-console */
