import { isNumericString } from "./is-numeric-string";

describe("isNumericString()", () => {
    it("should return true if given value is a numeric string", () => {
        expect(isNumericString("123")).toBe(true);
    });

    it("should return false if given value is not a numeric string", () => {
        expect(isNumericString("abc")).toBe(false);
    });
});
