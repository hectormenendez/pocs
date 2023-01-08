import * as $PATH from "std/path/mod.ts";
import * as $FS from "std/fs/walk.ts";

import { DefaultsCreateService } from "back/core/mod/defaults.ts";

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

export type OptWalk = Required<DefaultsCreateService>;

export type ItemWalk = {
    $name: string;
    $uuid: string;
    $path: string;
};

export async function ImportWalked<T extends Record<string, unknown>>(
    path: string,
    opt: OptWalk,
): Promise<(ItemWalk & T)[]> {
    const { optionsWalk, ext } = opt;
    try {
        const rx = /^([0-9]+)-(.+)/g;

        const result: (ItemWalk & T)[] = [];
        for await (const item of $FS.walk(path, optionsWalk)) {
            const { isFile } = item;
            if (!isFile) continue;
            const base = $PATH.basename(item.name, ext);
            const $uuid = base.replace(rx, "$1");
            const $name = base.replace(rx, "$2");
            const rest: T = await import(item.path);
            result.push({ $name, $uuid, $path: item.path, ...rest });
        }
        return result.sort((a, b) => (a.$uuid > b.$uuid ? 1 : -1));
    } catch (err) {
        Halt(`Could not Walk over ${path}: ${err.message}`);
    }
}
