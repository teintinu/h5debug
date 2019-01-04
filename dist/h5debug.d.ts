import "@hoda5/extensions";
export declare type H5DebugHandler = ((...args: any[]) => void) & {
    history(): string[];
};
export declare const h5debug: {
    [name: string]: H5DebugHandler;
};
export interface H5DebugOpts {
    disableConsole?: boolean;
    disableHistory?: boolean;
    handler?(...args: any[]): void | false;
}
export declare function enableDebug(name: string, opts?: H5DebugOpts): void;
export declare function disableDebug(name: string): void;
export declare function compareHistory(history: string[], expect: Array<string | RegExp>): string[] | "OK";
