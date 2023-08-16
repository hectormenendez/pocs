/// <reference types="astro/client" />

declare global {
    /** Extracts the [] from an Array Type */
    type UnArray<T> = T extends Array<infer U> ? U : T;

    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }

    // All globals go here
    // interface Window {}
}

export {};
