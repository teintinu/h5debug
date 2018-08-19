import "@hoda5/extensions";

export type H5DebugHandler =
    ((...args: any[]) => void) &
    {
        history(): string[];
    };

export const h5debug: {
    [name: string]: H5DebugHandler;
} = {};

export function enableDebug(
    name: string,
    opts?: {
        disbleConsole?: boolean,
        disableHistory?: boolean,
        handler?(...args: any[]): void | false;
    },
): void {
    const history: string[] = [];
    const m = {
        history(): string[] {
            return history;
        },
    };
    h5debug[name] = m.mergeObjWith((...args: any[]) => {
        if (opts && opts.handler) {
            if (opts.handler(...args) === false) return;
        }
        if (!(opts && opts.disableHistory)) {
            history.push(
                args
                    .map((a) => typeof a === "string" ? a : JSON.stringify(a))
                    .join(""),
            );
        }
        // tslint:disable-next-line:no-console
        if (!(opts && opts.disbleConsole)) console.log(...[name, ...args]);
    });
}

export function disableDebug(name: string): void {
    delete h5debug[name];
}
