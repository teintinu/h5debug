import { h5debug, enableDebug, disableDebug } from "./h5debug";

describe("h5debug", () => {
    it("h5debug", () => {
        expect(typeof h5debug.mytest).toBe("undefined");
        enableDebug("mytest", { disbleConsole: true });
        expect(typeof h5debug.mytest).toBe("function");

        const res: string[] = [];
        enableDebug("mytest", {
            disbleConsole: true,
            handler(...args: any[]) {
                res.push(args.join(""));
            },
        });
        h5debug.mytest("x", "y");
        expect(res).toEqual(["xy"]);
        expect(res).toEqual(h5debug.mytest.history());

        disableDebug("mytest");
        expect(typeof h5debug.mytest).toBe("undefined");
    });
});
