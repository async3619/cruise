import { render, screen } from "@testing-library/react";
import { LabelMenuItem } from "./LabelMenuItem.tsx";

import { Wrapper } from "../../__test__/Wrapper.tsx";

describe("<LabelMenuItem />", () => {
    it("should render LabelMenuItem component properly", () => {
        render(<LabelMenuItem item={{ label: "label", type: "label" }} />, {
            wrapper: Wrapper,
        });

        const item = screen.getByTestId("label-menu-item");
        expect(item).toBeInTheDocument();
    });

    it("should render given label properly", () => {
        render(<LabelMenuItem item={{ label: "test-label", type: "label" }} />, {
            wrapper: Wrapper,
        });

        const item = screen.getByText("test-label");
        expect(item).toBeInTheDocument();
    });
});
