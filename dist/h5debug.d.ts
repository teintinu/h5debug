import "@hoda5/extensions";
export declare type H5DebugHandler = ((...args: any[]) => void) & {
    history(): string[];
};
export declare const h5debug: {
    [name: string]: H5DebugHandler;
};
export declare function enableDebug(name: string, opts?: {
    disbleConsole?: boolean;
    disableHistory?: boolean;
    handler?(...args: any[]): void | false;
}): void;
export declare function disableDebug(name: string): void;
