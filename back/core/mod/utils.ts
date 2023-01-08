export function Capitalize(str: string): string {
    return [str.charAt(0).toUpperCase(), str.slice(1).toLowerCase()].join("");
}

export function Halt(...messages: unknown[]): never {
    console.error(...messages);
    Deno.exit(1);
}

export function Echo(...messages: unknown[]): void {
    console.log(...messages);
}

export class Perf {
    public static readonly TIME_SECOND = 1000;

    private start: number;

    public constructor() {
        this.start = performance.now();
    }

    public elapsed() {
        return (performance.now() - this.start) / Perf.TIME_SECOND;
    }
}
