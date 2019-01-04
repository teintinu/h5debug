import "@hoda5/extensions"

export type H5DebugHandler =
    ((...args: any[]) => void) &
    {
        clearHistory(),
        history(): string[],
    }

export const h5debug: {
    [name: string]: H5DebugHandler;
} = {}

export interface H5DebugOpts {
    disableConsole?: boolean,
    disableHistory?: boolean,
    handler?(...args: any[]): void | false,
}

export function enableDebug(
    name: string,
    opts?: H5DebugOpts,
): void {
    if (!name) throw new Error("Invalid name")
    let history: string[] = []
    const m = {
        clearHistory() {
            history = []
        },
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
                    typeof a === "string" ?
                        a.replace(/"/g, "\uFF02")
                        : JSON.stringify(a,
                            (k, v) => typeof v === "string" ? v.replace(/"/g, "\uFF02") : v)
                            .replace(/"/g, "\uFF02"),
                ).join(""),
            )
        }
        // tslint:disable-next-line:no-console
        if (!(opts && opts.disableConsole)) console.log(...[name, ...args])
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
    if (ie < expect.length || ih === 0) {
        if (history.length === 0) matches.push("=>NO HISTORY")
        if (expect.length === 0) matches.push("=>NO EXPECT")
        else {
            matches.push(["=>not matches: ",
                expect.slice(ie).map((e) => e.toString()).join("|"),
            ].join(""))
        }
        return matches
    }
    return "OK"
    function match() {
        const h = history[ih].replace(/"/g, "\uFF02")
        const e = expect[ie]
        let sr: string = ""
        if (typeof e === "string") {
            const r1 = h.indexOf(e.replace(/"/g, "\uFF02")) >= 0
            if (r1) sr = e
        } else {
            const nr = new RegExp(e.source.replace(/"/g, "\uFF02"), e.flags)
            if (nr.test(h)) sr = e.toString()
        }
        if (!sr) {
            matches.push("=>(SKIP) " + h)
            return false
        }
        const m: string[] = ["=>(OK:", sr, ") ", h]
        matches.push(m.join(""))
        return true
    }
}
