import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { SwitchConfigListItem } from "./SwitchItem";

import { Wrapper } from "../../__test__/Wrapper";
import { MOCK_CONFIG, SWITCH_CONFIG_LIST_ITEM } from "../../__test__/ConfigList";

describe("<SwitchConfigListItem />", () => {
    it("should render SwitchConfigListItem component properly", () => {
        render(<SwitchConfigListItem config={MOCK_CONFIG} item={SWITCH_CONFIG_LIST_ITEM} setConfig={jest.fn()} />, {
            wrapper: Wrapper,
        });

        const item = screen.getByTestId("SwitchConfigListItem");
        expect(item).toBeInTheDocument();
    });

    it("should render options properly", () => {
        render(
            <SwitchConfigListItem
                config={MOCK_CONFIG}
                item={{ ...SWITCH_CONFIG_LIST_ITEM, labels: { test: "test", mock: "mock" } }}
                setConfig={jest.fn()}
            />,
            { wrapper: Wrapper },
        );

        const test = screen.getByText("test");
        const mock = screen.getByText("mock");

        expect(test).toBeInTheDocument();
        expect(mock).toBeInTheDocument();
    });

    it("should call setConfig prop when radio button is clicked", () => {
        const setConfig = jest.fn();
        render(<SwitchConfigListItem config={MOCK_CONFIG} item={SWITCH_CONFIG_LIST_ITEM} setConfig={setConfig} />, {
            wrapper: Wrapper,
        });

        const radios = screen.getAllByRole("radio");
        fireEvent.click(radios[0]);

        expect(setConfig).toHaveBeenCalledTimes(1);
    });
});
