import { Nullable } from "types";
import { Button, ButtonProps } from "ui";

import React from "react";
import Measure, { ContentRect, MeasuredComponentProps } from "react-measure";

import { Box, Skeleton, Stack, Typography } from "@mui/material";

import { Page } from "@components/Page";
import { AlbumArt } from "@components/AlbumArt";
import { withLayout, WithLayoutProps } from "@components/Layout/withLayout";
import { Content, Description, ImageWrapper, Root } from "@components/Page/ShrinkHeader.styles";

import { MinimalAlbumArt } from "@utils/types";

export interface ButtonItem extends Omit<ButtonProps, "children"> {
    label: string;
}

export interface ShrinkHeaderPageProps extends WithLayoutProps {
    children?: React.ReactNode;
    title: string;
    subtitle?: string;
    tokens?: Array<string | number>;
    albumArt: Nullable<MinimalAlbumArt>;
    buttons: ButtonItem[];
    loading?: boolean;
}
export interface ShrinkHeaderPageStates {}

class ShrinkHeaderPageImpl extends React.Component<ShrinkHeaderPageProps, ShrinkHeaderPageStates> {
    private readonly imageViewRef = React.createRef<HTMLDivElement>();
    private readonly descriptionRef = React.createRef<HTMLDivElement>();
    private readonly rootRef = React.createRef<HTMLDivElement>();

    private buttonContainerHeight: number | null = null;
    private titleHeight: number | null = null;
    private scrollY = 0;
    private unmounted = false;
    private lastHeight = 0;

    public componentDidMount() {
        if (this.props.view) {
            this.props.view.addEventListener("scroll", this.handleScroll);
            window.requestAnimationFrame(this.handleFrame);
        }
    }
    public componentDidUpdate(prevProps: Readonly<ShrinkHeaderPageProps>) {
        if (this.props.view !== prevProps.view) {
            if (prevProps.view) {
                prevProps.view.removeEventListener("scroll", this.handleScroll);
            }

            if (this.props.view) {
                this.props.view.addEventListener("scroll", this.handleScroll);
                window.requestAnimationFrame(this.handleFrame);
            }
        }
    }
    public componentWillUnmount() {
        if (this.props.view) {
            this.props.view.removeEventListener("scroll", this.handleScroll);
        }

        this.unmounted = true;
    }

    private handleFrame = () => {
        if (this.unmounted) {
            return;
        }

        requestAnimationFrame(this.handleFrame);

        if (
            !this.imageViewRef.current ||
            !this.descriptionRef.current ||
            !this.buttonContainerHeight ||
            !this.titleHeight
        ) {
            return;
        }

        const imageView = this.imageViewRef.current;
        const minWidth = this.buttonContainerHeight + this.titleHeight + 12;
        const maxWidth = 200;

        const width = Math.max(minWidth, maxWidth - this.scrollY);
        const hiddenWidth = minWidth + (maxWidth - minWidth) * 0.5;
        const progress = (width - hiddenWidth) / (maxWidth - hiddenWidth);

        imageView.style.width = `${width}px`;
        imageView.style.flexBasis = `${width}px`;
        this.descriptionRef.current.style.opacity = `${progress}`;

        if (!this.rootRef.current) {
            return;
        }

        const { height: headerHeight } = this.rootRef.current.getBoundingClientRect();
        if (headerHeight === this.lastHeight) {
            return;
        }

        this.lastHeight = headerHeight;
    };
    private handleScroll = () => {
        if (!this.props.view) {
            return;
        }

        const { scrollTop } = this.props.view;
        this.scrollY = scrollTop;
    };
    private handleButtonContainerMeasure = ({ bounds }: ContentRect) => {
        if (!bounds) {
            return;
        }

        this.buttonContainerHeight = bounds.height;
    };
    private handleTitleMeasure = ({ bounds }: ContentRect) => {
        if (!bounds) {
            return;
        }

        this.titleHeight = bounds.height;
    };

    private renderButtonContainer = ({ measureRef }: MeasuredComponentProps) => {
        const { buttons } = this.props;

        return (
            <Stack ref={measureRef} spacing={1} direction="row">
                {buttons.map((button, index) => (
                    <Button key={index} {...button}>
                        {button.label}
                    </Button>
                ))}
            </Stack>
        );
    };
    private renderTitle = ({ measureRef }: MeasuredComponentProps) => {
        const { title, loading = false } = this.props;

        return (
            <Typography
                ref={measureRef}
                variant="h3"
                fontSize="1.75rem"
                sx={{
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                }}
            >
                {!loading && <span>{title}</span>}
                {loading && <Skeleton width="50%" />}
            </Typography>
        );
    };
    private renderHeader = () => {
        const { subtitle, tokens, albumArt, loading = false } = this.props;

        return (
            <Root>
                <ImageWrapper ref={this.imageViewRef}>
                    <AlbumArt albumArt={albumArt} />
                </ImageWrapper>
                <Content>
                    <Measure bounds onResize={this.handleTitleMeasure}>
                        {this.renderTitle}
                    </Measure>
                    <Description ref={this.descriptionRef}>
                        {subtitle && (
                            <Typography
                                fontWeight={600}
                                variant="h4"
                                fontSize="1.25rem"
                                sx={{ mt: 1 }}
                                color="text.secondary"
                            >
                                {!loading && <span>{subtitle}</span>}
                                {loading && <Skeleton width="25%" />}
                            </Typography>
                        )}
                        {tokens && (
                            <Typography
                                fontWeight={600}
                                variant="body1"
                                fontSize="0.9rem"
                                sx={{ mt: 2 }}
                                color="text.disabled"
                            >
                                {!loading && <span>{tokens.join(" · ")}</span>}
                                {loading && <Skeleton width="12.5%" />}
                            </Typography>
                        )}
                    </Description>
                    <Box flex="1 1 auto" />
                    <Measure bounds onResize={this.handleButtonContainerMeasure}>
                        {this.renderButtonContainer}
                    </Measure>
                </Content>
            </Root>
        );
    };
    public render() {
        const { children } = this.props;

        return (
            <Page header={this.renderHeader()} headerRef={this.rootRef} headerPosition="fixed">
                {children}
            </Page>
        );
    }
}

export const ShrinkHeaderPage = withLayout(ShrinkHeaderPageImpl);
