import "@hoda5/extensions"

export type H5DebugHandler =
    ((...args: any[]) => void) &
    {
        history(): string[];
    }

export const h5debug: {
    [name: string]: H5DebugHandler;
} = {}

export function enableDebug(
    name: string,
    opts?: {
        disbleConsole?: boolean,
        disableHistory?: boolean,
        handler?(...args: any[]): void | false;
    },
): void {
    const history: string[] = []
    const m = {
        history(): string[] {
            return history
        },
    }
    h5debug[name] = m.mergeObjWith((...args: any[]) => {
        if (opts && opts.handler) {
            if (opts.handler(...args) === false) return
        }
        if (!(opts && opts.disableHistory)) {
            history.push(
                args.map((a) =>
                    typeof a === "string" ? a : JSON.stringify(a))
                    .join(""),
            )
        }
        // tslint:disable-next-line:no-console
        if (!(opts && opts.disbleConsole)) console.log(...[name, ...args])
    })
}

export function disableDebug(name: string): void {
    delete h5debug[name]
}

export function compareHistory(history: string[], expect: Array<string | RegExp>) {
    let ih = 0
    let ie = 0
    const matches: string[] = []
    while (ih < history.length && ie < expect.length) {
        if (match()) ie++
        ih++
    }
    if (ie < expect.length) {
        return matches.concat(["not matches: ",
            expect.slice(ie).map((e) => e.toString()).join("|"),
        ].join(""))
    }
    return "OK"
    function match() {
        const h = history[ih]
        const e = expect[ie]
        let sr: string = ""
        if (typeof e === "string") {
            const r1 = h.indexOf(e) >= 0
            if (r1) sr = e
        } else if (e.test(h)) sr = e.toString()
        if (!sr) {
            matches.push("=>(SKIP) " + h)
            return false
        }
        const m: string[] = ["=>(OK:", sr, ") ", h]
        matches.push(m.join(""))
        return true
    }
}
