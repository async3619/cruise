import React from "react";
import { render, screen } from "@testing-library/react";

import { Wrapper } from "../../__test__/Wrapper";
import { ACTION_CONFIG_LIST_ITEM, MOCK_CONFIG, SWITCH_CONFIG_LIST_ITEM } from "../../__test__/ConfigList";

import { ConfigList } from "./ConfigList";

describe("<ConfigList />", () => {
    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    it("should render ConfigList component properly", () => {
        render(<ConfigList config={{}} onChange={jest.fn()} items={[]} />, {
            wrapper: Wrapper,
        });

        const item = screen.getByTestId("ConfigList");
        expect(item).toBeInTheDocument();
    });

    it("should render given switch item properly", () => {
        render(<ConfigList config={MOCK_CONFIG} onChange={jest.fn()} items={[SWITCH_CONFIG_LIST_ITEM]} />, {
            wrapper: Wrapper,
        });

        const item = screen.getByTestId("SwitchConfigListItem");
        expect(item).toBeInTheDocument();
    });

    it("should render given action item properly", () => {
        render(<ConfigList config={MOCK_CONFIG} onChange={jest.fn()} items={[ACTION_CONFIG_LIST_ITEM]} />, {
            wrapper: Wrapper,
        });

        const item = screen.getByTestId("ActionConfigListItem");
        expect(item).toBeInTheDocument();
    });

    it("should throw error when unknown config item type is given", () => {
        expect(() =>
            render(
                <ConfigList
                    config={MOCK_CONFIG}
                    onChange={jest.fn()}
                    items={[{ ...SWITCH_CONFIG_LIST_ITEM, type: "unknown" as any }]}
                />,
                {
                    wrapper: Wrapper,
                },
            ),
        ).toThrowError("Unknown config item type: unknown");
    });
});
