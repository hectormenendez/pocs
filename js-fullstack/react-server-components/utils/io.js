export function Halt(...args) { 
    console.error(...args);
    process.exit(1);
}