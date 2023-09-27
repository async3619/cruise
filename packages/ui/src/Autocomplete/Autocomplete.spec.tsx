import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { Autocomplete } from "./Autocomplete";
import { Wrapper } from "../../__test__/Wrapper";

describe("<Autocomplete />", () => {
    it("should render Autocomplete component properly", () => {
        render(<Autocomplete getItemLabel={jest.fn()} items={[]} renderInput={props => <input {...props} />} />, {
            wrapper: Wrapper,
        });

        const item = screen.getByTestId("Autocomplete");
        expect(item).toBeInTheDocument();
    });

    it("should show suggestion items when input is focused", () => {
        render(
            <Autocomplete
                getItemLabel={item => item.label}
                items={[{ label: "test", value: "test" }]}
                renderInput={props => <input {...props} data-testid="Input" />}
            />,
            { wrapper: Wrapper },
        );

        const input = screen.getByTestId("Input");

        act(() => {
            fireEvent.focus(input);
        });

        act(() => {
            fireEvent.input(input, { target: { value: "test" } });
        });

        const item = screen.getByTestId("suggestion-option");
        expect(item).toBeInTheDocument();
    });

    it("should call item resolving function if a function is passed", async () => {
        const getItems = jest.fn().mockResolvedValueOnce([{ label: "test", value: "test" }]);

        render(
            <Autocomplete<{ label: string; value: string }>
                getItemLabel={item => item.label}
                items={getItems}
                renderInput={props => <input {...props} data-testid="Input" />}
            />,
            { wrapper: Wrapper },
        );

        const input = screen.getByTestId("Input");

        await act(async () => {
            fireEvent.focus(input);
        });

        act(() => {
            fireEvent.input(input, { target: { value: "test" } });
        });

        expect(getItems).toHaveBeenCalledTimes(1);
    });

    it("should pass loading state to input renderer function", async () => {
        const getItems = jest.fn().mockImplementation(async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            return [{ label: "test", value: "test" }];
        });

        const renderInput = jest.fn(props => <input {...props} data-testid="Input" />);

        render(
            <Autocomplete<{ label: string; value: string }>
                getItemLabel={item => item.label}
                items={getItems}
                renderInput={renderInput}
            />,
            { wrapper: Wrapper },
        );

        const input = screen.getByTestId("Input");

        await act(async () => {
            fireEvent.focus(input);
        });

        act(() => {
            fireEvent.input(input, { target: { value: "test" } });
        });

        expect(getItems).toHaveBeenCalledTimes(1);
        expect(renderInput).toHaveBeenCalledWith(expect.any(Object), true);
    });

    it("should use custom item key resolver function if provided", async () => {
        const getItems = jest.fn().mockResolvedValueOnce([{ label: "test", value: "test" }]);
        const getItemKey = jest.fn().mockReturnValue("test");

        render(
            <Autocomplete<{ label: string; value: string }>
                getItemLabel={item => item.label}
                items={getItems}
                getItemKey={getItemKey}
                renderInput={props => <input {...props} data-testid="Input" />}
            />,
            { wrapper: Wrapper },
        );

        const input = screen.getByTestId("Input");

        await act(async () => {
            fireEvent.focus(input);
        });

        act(() => {
            fireEvent.input(input, { target: { value: "test" } });
        });

        expect(getItemKey).toHaveBeenCalled();
    });

    it("should be able to render auto completion item with icons if function is provided", async () => {
        const getItems = jest.fn().mockResolvedValueOnce([{ label: "test", value: "test" }]);
        const getItemIcon = jest.fn().mockReturnValue(<i data-testid="test">test</i>);

        render(
            <Autocomplete<{ label: string; value: string }>
                getItemLabel={item => item.label}
                items={getItems}
                getItemIcon={getItemIcon}
                renderInput={props => <input {...props} data-testid="Input" />}
            />,
            { wrapper: Wrapper },
        );

        const input = screen.getByTestId("Input");

        await act(async () => {
            fireEvent.focus(input);
        });

        act(() => {
            fireEvent.input(input, { target: { value: "test" } });
        });

        const item = screen.getByTestId("test");
        expect(item).toBeInTheDocument();
    });

    it("should hide auto completion dropdown if input control is blurred", async () => {
        render(
            <Autocomplete
                getItemLabel={item => item.label}
                items={[{ label: "test", value: "test" }]}
                renderInput={props => <input {...props} data-testid="Input" />}
            />,
            { wrapper: Wrapper },
        );

        const input = screen.getByTestId("Input");

        act(() => {
            fireEvent.focus(input);
        });

        act(() => {
            fireEvent.blur(input);
        });

        const item = screen.queryByTestId("suggestion-option");
        expect(item).not.toBeInTheDocument();
    });
});
