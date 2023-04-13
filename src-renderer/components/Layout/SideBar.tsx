import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Measure, { ContentRect, MeasuredComponentProps } from "react-measure";

import withLayout, { WithLayoutProps } from "@components/Layout/withLayout";
import List from "@components/List";
import Autocomplete from "@components/UI/Autocomplete";

import { ListItemType, NormalListItem } from "@components/List/index.types";
import { Backdrop, Root, SearchWrapper, Wrapper } from "@components/Layout/SideBar.styles";

import { NAVIGATION_ITEMS, SHRINK_NAVIGATION_ITEMS } from "@constants/navigation";

export type SideBarState = "default" | "shrink" | "hidden";

interface SideBarProps extends WithLayoutProps {
    navigate: ReturnType<typeof useNavigate>;
    location: ReturnType<typeof useLocation>;
    state: SideBarState;
}
interface SideBarStates {
    selectedItem: ListItemType | undefined;
    searchValue: string;
}

interface SearchOption {
    label: string;
    value: string;
}

class SideBar extends React.Component<SideBarProps> {
    public state: SideBarStates = {
        selectedItem: NAVIGATION_ITEMS.find(
            item => typeof item !== "string" && item.id === this.props.location.pathname,
        ),
        searchValue: "",
    };

    public componentDidUpdate(prevProps: Readonly<SideBarProps>) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            const selectedItem = NAVIGATION_ITEMS.find(
                item => typeof item !== "string" && item.id === this.props.location.pathname,
            );

            this.setState({ selectedItem });
        }
    }

    private handleSearchChange = (_: any, value: string) => {
        this.setState({ searchValue: value });
    };
    private handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const { searchValue } = this.state;
        if (e.key !== "Enter" || !searchValue) {
            return;
        }

        this.props.navigate(`/search/${encodeURIComponent(searchValue)}`);
        this.setState({ searchValue: "" });
    };
    private handleClick = (item: NormalListItem) => {
        if (item.id === "expand") {
            this.props.layout.setSideBarOpen(!this.props.layout.sideBarOpen);
            return;
        }

        if (this.props.layout.sideBarOpen) {
            this.props.layout.setSideBarOpen(false);
        }

        this.props.navigate(item.id);
    };
    private handleResize = ({ bounds }: ContentRect) => {
        const { state, layout } = this.props;
        if (state === "hidden") {
            layout.setSideBarWidth(0);
            return;
        }

        if (state === "shrink" && layout.sideBarOpen) {
            return;
        }

        if (!bounds || bounds.width === layout.sideBarWidth) {
            return;
        }

        layout.setSideBarWidth(bounds.width);
    };
    private handleBackdropClick = () => {
        this.props.layout.setSideBarOpen(false);
    };

    private renderContent = ({ measureRef }: MeasuredComponentProps) => {
        const { state, layout } = this.props;
        const { selectedItem, searchValue } = this.state;
        const items = state === "shrink" ? SHRINK_NAVIGATION_ITEMS : NAVIGATION_ITEMS;

        return (
            <Root
                ref={measureRef}
                isShrink={state === "shrink"}
                isHidden={state === "hidden"}
                isOpen={layout.sideBarOpen}
            >
                <SearchWrapper>
                    <Autocomplete<SearchOption>
                        value={searchValue}
                        multiple={false}
                        idField="value"
                        labelField="label"
                        options={[]}
                        inputProps={{ placeholder: "Search" }}
                        onKeyDown={this.handleSearchKeyDown}
                        onChange={this.handleSearchChange}
                    />
                </SearchWrapper>
                <List
                    iconOnly={state === "shrink" && !layout.sideBarOpen}
                    items={items}
                    onClick={this.handleClick}
                    selectedItem={selectedItem}
                />
            </Root>
        );
    };
    public render() {
        const { state, layout } = this.props;
        const wrapperWidth = state === "shrink" && layout.sideBarOpen ? layout.sideBarWidth || 0 : "auto";

        return (
            <Wrapper style={{ width: wrapperWidth }}>
                <Measure bounds onResize={this.handleResize}>
                    {this.renderContent}
                </Measure>
                {state === "shrink" && layout.sideBarOpen && <Backdrop onClick={this.handleBackdropClick} />}
            </Wrapper>
        );
    }
}

export default withLayout(SideBar);
