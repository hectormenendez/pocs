import GomodoroCounter$ from './gomodoro-counter';

/* eslint-disable no-console */
GomodoroCounter$.subscribe(
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
