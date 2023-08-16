declare global {
    type State = Record<string, unknown>;

    type Next = () => Promise<unknown>;
}

export {};
