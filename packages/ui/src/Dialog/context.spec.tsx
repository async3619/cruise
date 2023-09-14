import React from "react";
import { render } from "@testing-library/react";

import { DialogContext, useDialog } from "./context";

describe("useDialog()", () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    it("should return the context value", () => {
        function MockComponent() {
            const context = useDialog();
            expect(context).toEqual({});

            return null;
        }

        render(
            <DialogContext.Provider value={{} as any}>
                <MockComponent />
            </DialogContext.Provider>,
        );
    });

    it("should throw an error if used outside of a <DialogProvider />", () => {
        function MockComponent() {
            useDialog();

            return null;
        }

        expect(() => render(<MockComponent />)).toThrowError("useDialog must be used within a <DialogProvider />");
    });
});
