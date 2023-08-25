import React from "react";

import { render } from "@testing-library/react";

import { Toast } from "./Toast";
import { Wrapper } from "../../__test__/Wrapper";

const MOCK_ITEM = {
    id: "1",
    message: "test",
    close: () => {},
};

describe("<Toast />", () => {
    it("should render corresponding icon for severity", () => {
        let context = render(<Toast item={{ ...MOCK_ITEM, severity: "info" }} />, { wrapper: Wrapper });
        expect(context.getByTestId("toast-info-icon")).toBeInTheDocument();

        context = render(<Toast item={{ ...MOCK_ITEM, severity: "error" }} />, { wrapper: Wrapper });
        expect(context.getByTestId("toast-error-icon")).toBeInTheDocument();

        context = render(<Toast item={{ ...MOCK_ITEM, severity: "warning" }} />, { wrapper: Wrapper });
        expect(context.getByTestId("toast-warning-icon")).toBeInTheDocument();

        context = render(<Toast item={{ ...MOCK_ITEM, severity: "success" }} />, { wrapper: Wrapper });
        expect(context.getByTestId("toast-success-icon")).toBeInTheDocument();
    });

    it("should render without icon if severity is undefined", () => {
        const context = render(<Toast item={{ ...MOCK_ITEM, severity: undefined }} />, { wrapper: Wrapper });
        expect(context.queryByTestId("toast-info-icon")).not.toBeInTheDocument();
        expect(context.queryByTestId("toast-error-icon")).not.toBeInTheDocument();
        expect(context.queryByTestId("toast-warning-icon")).not.toBeInTheDocument();
        expect(context.queryByTestId("toast-success-icon")).not.toBeInTheDocument();
    });

    it("should render loading icon if loading is true", () => {
        const context = render(<Toast item={{ ...MOCK_ITEM, loading: true }} />, { wrapper: Wrapper });
        expect(context.getByTestId("toast-loading")).toBeInTheDocument();
    });

    it("should call close when 3000ms has passed", () => {
        jest.useFakeTimers();
        const close = jest.fn();
        render(<Toast item={{ ...MOCK_ITEM, close }} />, { wrapper: Wrapper });
        jest.advanceTimersByTime(3000);
        expect(close).toHaveBeenCalled();
    });

    it("should not call close when 3000ms has passed if persist is true", () => {
        jest.useFakeTimers();
        const close = jest.fn();
        render(<Toast item={{ ...MOCK_ITEM, close, persist: true }} />, { wrapper: Wrapper });
        jest.advanceTimersByTime(3000);
        expect(close).not.toHaveBeenCalled();
    });

    it("should call action.onClick when action button is clicked", () => {
        const onClick = jest.fn();
        const context = render(<Toast item={{ ...MOCK_ITEM, action: { label: "test", onClick } }} />, {
            wrapper: Wrapper,
        });
        context.getByTestId("toast-action").click();
        expect(onClick).toHaveBeenCalled();
    });
});
