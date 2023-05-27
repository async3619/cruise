import React from "react";
import Measure, { ContentRect, MeasuredComponentProps } from "react-measure";

import { Box, Stack, Typography } from "@mui/material";

import { Page } from "@components/Page";
import { ImageView } from "@components/ui/ImageView";
import { Button } from "@components/ui/Button";

import { withLayout, WithLayoutProps } from "@components/Layout/withLayout";
import { Content, Description, ImageWrapper, Root } from "@components/Page/ShrinkHeader.styles";
import { CollageView } from "@components/ui/CollageView";

export interface ButtonItem extends React.ComponentProps<typeof Button> {
    label: string;
}

export interface ShrinkHeaderPageProps extends WithLayoutProps {
    children?: React.ReactNode;
    title: string;
    subtitle?: string;
    tokens?: Array<string | number>;
    imageSrc?: string | string[];
    buttons?: ButtonItem[];
    imageType?: "circle" | "square";
    denseHeaderMargin?: boolean;
}
export interface ShrinkHeaderPageStates {}

export interface ShrinkHeaderContextValue {
    subscribe(callback: (height: number) => void): void;
    unsubscribe(callback: (height: number) => void): void;
}

export const ShrinkHeaderContext = React.createContext<ShrinkHeaderContextValue | null>(null);

export function useShrinkHeader() {
    const context = React.useContext(ShrinkHeaderContext);
    if (!context) {
        throw new Error("useShrinkHeader must be used within a ShrinkHeaderPage");
    }

    return context;
}

class ShrinkHeaderPageImpl extends React.Component<ShrinkHeaderPageProps, ShrinkHeaderPageStates> {
    private readonly imageViewRef = React.createRef<HTMLDivElement>();
    private readonly descriptionRef = React.createRef<HTMLDivElement>();
    private readonly rootRef = React.createRef<HTMLDivElement>();

    private buttonContainerHeight: number | null = null;
    private titleHeight: number | null = null;
    private scrollY = 0;
    private unmounted = false;
    private subscribers: Array<(height: number) => void> = [];
    private lastHeight = 0;

    public componentDidMount() {
        if (this.props.scrollView) {
            this.props.scrollView.addEventListener("scroll", this.handleScroll);
            window.requestAnimationFrame(this.handleFrame);
        }
    }
    public componentDidUpdate(prevProps: Readonly<ShrinkHeaderPageProps>) {
        if (this.props.scrollView !== prevProps.scrollView) {
            if (prevProps.scrollView) {
                prevProps.scrollView.removeEventListener("scroll", this.handleScroll);
            }

            if (this.props.scrollView) {
                this.props.scrollView.addEventListener("scroll", this.handleScroll);
                window.requestAnimationFrame(this.handleFrame);
            }
        }
    }
    public componentWillUnmount() {
        if (this.props.scrollView) {
            this.props.scrollView.removeEventListener("scroll", this.handleScroll);
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

        this.notify(headerHeight);
        this.lastHeight = headerHeight;
    };
    private handleScroll = () => {
        if (!this.props.scrollView) {
            return;
        }

        const { scrollTop } = this.props.scrollView;
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

    private subscribe = (callback: (height: number) => void) => {
        this.subscribers.push(callback);
    };
    private unsubscribe = (callback: (height: number) => void) => {
        this.subscribers = this.subscribers.filter(subscriber => subscriber !== callback);
    };
    private notify = (height: number) => {
        this.subscribers.forEach(subscriber => subscriber(height));
    };

    private renderButtonContainer = ({ measureRef }: MeasuredComponentProps) => {
        const { buttons } = this.props;

        return (
            <Stack ref={measureRef} spacing={1} direction="row">
                {buttons?.map((button, index) => (
                    <Button key={index} {...button} size="small">
                        {button.label}
                    </Button>
                ))}
            </Stack>
        );
    };
    private renderTitle = ({ measureRef }: MeasuredComponentProps) => {
        const { title } = this.props;

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
                <span>{title}</span>
            </Typography>
        );
    };
    private renderHeader = () => {
        const { subtitle, imageSrc, tokens, imageType = "square" } = this.props;

        return (
            <Root>
                <ImageWrapper ref={this.imageViewRef}>
                    {!Array.isArray(imageSrc) && <ImageView type={imageType} src={imageSrc} />}
                    {Array.isArray(imageSrc) && <CollageView src={imageSrc} />}
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
                                <span>{subtitle}</span>
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
                                <span>{tokens.join(" · ")}</span>
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
        const { children, denseHeaderMargin } = this.props;

        return (
            <ShrinkHeaderContext.Provider
                value={{
                    subscribe: this.subscribe,
                    unsubscribe: this.unsubscribe,
                }}
            >
                <Page
                    denseHeaderMargin={denseHeaderMargin}
                    headerPosition="fixed"
                    renderHeader={this.renderHeader}
                    headerRef={this.rootRef}
                >
                    {children}
                </Page>
            </ShrinkHeaderContext.Provider>
        );
    }
}

export const ShrinkHeaderPage = withLayout(ShrinkHeaderPageImpl);
