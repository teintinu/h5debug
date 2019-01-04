import { h5debug, enableDebug, disableDebug, compareHistory } from "./h5debug"

describe("h5debug", () => {
    it("h5debug", () => {
        expect(typeof h5debug.mytest).toBe("undefined")
        enableDebug("mytest", { disbleConsole: true })
        expect(typeof h5debug.mytest).toBe("function")

        const res: string[] = []
        enableDebug("mytest", {
            disbleConsole: true,
            handler(...args: any[]) {
                res.push(args.join(""))
            },
        })
        h5debug.mytest("a", "b")
        h5debug.mytest("x", "y")
        expect(res).toEqual(["ab", "xy"])
        expect(h5debug.mytest.history()).toEqual(["ab", "xy"])

        expect(compareHistory(h5debug.mytest.history(), ["ab"])).toEqual("OK")
        expect(compareHistory(h5debug.mytest.history(), ["ab", "xy"])).toEqual("OK")
        expect(compareHistory(h5debug.mytest.history(), ["xy", "ab"])).toEqual(["=>(SKIP) ab", "=>(OK:xy) xy", "not matches: ab"])
        expect(compareHistory(h5debug.mytest.history(), ["k"])).toEqual(["=>(SKIP) ab", "=>(SKIP) xy", "not matches: k"])
        expect(compareHistory(h5debug.mytest.history(), ["a", "k"])).toEqual(["=>(OK:a) ab", "=>(SKIP) xy", "not matches: k"])
        expect(compareHistory(h5debug.mytest.history(), ["a", "x", "k"])).toEqual(["=>(OK:a) ab", "=>(OK:x) xy", "not matches: k"])

        expect(compareHistory(h5debug.mytest.history(), [/AB/i])).toEqual("OK")
        expect(compareHistory(h5debug.mytest.history(), [/AB/i, "xy"])).toEqual("OK")
        expect(compareHistory(h5debug.mytest.history(), ["xy", /AB/i])).toEqual(["=>(SKIP) ab", "=>(OK:xy) xy", "not matches: /AB/i"])
        expect(compareHistory(h5debug.mytest.history(), [/k/])).toEqual(["=>(SKIP) ab", "=>(SKIP) xy", "not matches: /k/"])
        expect(compareHistory(h5debug.mytest.history(), [/A/i, /k/])).toEqual(["=>(OK:/A/i) ab", "=>(SKIP) xy", "not matches: /k/"])
        expect(compareHistory(h5debug.mytest.history(), [/A/i, "x", /k/])).toEqual(["=>(OK:/A/i) ab", "=>(OK:x) xy", "not matches: /k/"])

        disableDebug("mytest")
        expect(typeof h5debug.mytest).toBe("undefined")

    })
})
