import { h5debug, enableDebug, disableDebug, compareHistory } from "./h5debug"

describe("h5debug", () => {
    it("default", () => {
        expect(typeof h5debug.mytest).toBe("undefined")
        enableDebug("mytest", { disableConsole: true })
        expect(typeof h5debug.mytest).toBe("function")

        enableDebug("mytest")

        h5debug.mytest("a", "b")
        h5debug.mytest("x", "y")
        expect(h5debug.mytest.history()).toEqual(["ab", "xy"])

        expect(compareHistory(h5debug.mytest.history(), ["ab"])).toEqual("OK")
        expect(compareHistory(h5debug.mytest.history(), ["ab", "xy"])).toEqual("OK")
        expect(compareHistory(h5debug.mytest.history(),
            ["xy", "ab"])).toEqual(["=>(SKIP) ab", "=>(OK:xy) xy", "=>not matches: ab"])
        expect(compareHistory(h5debug.mytest.history(),
            ["k"])).toEqual(["=>(SKIP) ab", "=>(SKIP) xy", "=>not matches: k"])
        expect(compareHistory(h5debug.mytest.history(),
            ["a", "k"])).toEqual(["=>(OK:a) ab", "=>(SKIP) xy", "=>not matches: k"])
        expect(compareHistory(h5debug.mytest.history(),
            ["a", "x", "k"])).toEqual(["=>(OK:a) ab", "=>(OK:x) xy", "=>not matches: k"])

        expect(compareHistory(h5debug.mytest.history(), [/AB/i])).toEqual("OK")
        expect(compareHistory(h5debug.mytest.history(), [/AB/i, "xy"])).toEqual("OK")
        expect(compareHistory(h5debug.mytest.history(),
            ["xy", /AB/i])).toEqual(["=>(SKIP) ab", "=>(OK:xy) xy", "=>not matches: /AB/i"])
        expect(compareHistory(h5debug.mytest.history(),
            [/k/])).toEqual(["=>(SKIP) ab", "=>(SKIP) xy", "=>not matches: /k/"])
        expect(compareHistory(h5debug.mytest.history(),
            [/A/i, /k/])).toEqual(["=>(OK:/A/i) ab", "=>(SKIP) xy", "=>not matches: /k/"])
        expect(compareHistory(h5debug.mytest.history(),
            [/A/i, "x", /k/])).toEqual(["=>(OK:/A/i) ab", "=>(OK:x) xy", "=>not matches: /k/"])

        h5debug.mytest.clearHistory()
        expect(compareHistory(h5debug.mytest.history(),
            [])).toEqual(["=>NO HISTORY", "=>NO EXPECT"])
        h5debug.mytest("1")
        h5debug.mytest({ k: "quote\"" })
        h5debug.mytest("2")
        expect(compareHistory(h5debug.mytest.history(),
            ["1", "{\uFF02k\uFF02:\uFF02quote\uFF02\uFF02", "2"])).toEqual("OK")

        disableDebug("mytest")
        expect(typeof h5debug.mytest).toBe("undefined")
    })
    it("handler with history", () => {
        expect(typeof h5debug.mytest).toBe("undefined")
        enableDebug("mytest", { disableConsole: true })
        expect(typeof h5debug.mytest).toBe("function")

        const res: string[] = []
        enableDebug("mytest", {
            disableConsole: true,
            handler(...args: any[]) {
                res.push(args.join(""))
            },
        })

        h5debug.mytest("a", "b")
        h5debug.mytest("x", "y")
        expect(res).toEqual(["ab", "xy"])
        expect(h5debug.mytest.history()).toEqual(["ab", "xy"])

        disableDebug("mytest")
        expect(typeof h5debug.mytest).toBe("undefined")

    })
    it("handler disableHistory", () => {
        expect(typeof h5debug.mytest).toBe("undefined")

        const res: string[] = []
        enableDebug("mytest", {
            disableConsole: true,
            disableHistory: true,
            handler(...args: any[]) {
                res.push(args.join(""))
            },
        })
        expect(typeof h5debug.mytest).toBe("function")

        h5debug.mytest("a", "b")
        h5debug.mytest("x", "y")
        expect(res).toEqual(["ab", "xy"])
        expect(h5debug.mytest.history()).toEqual([])
        disableDebug("mytest")
    })
    it("handler with false", () => {
        expect(typeof h5debug.mytest).toBe("undefined")

        const res: string[] = []
        enableDebug("mytest", {
            handler(...args: any[]) {
                res.push(args.join(""))
                return false
            },
        })
        expect(typeof h5debug.mytest).toBe("function")

        h5debug.mytest("a", "b")
        h5debug.mytest("x", "y")
        expect(res).toEqual(["ab", "xy"])
        expect(h5debug.mytest.history()).toEqual([])
        disableDebug("mytest")
    })

    it("invalid name", () => {
        expect(() => enableDebug("")).toThrow("Invalid name")
    })
})
