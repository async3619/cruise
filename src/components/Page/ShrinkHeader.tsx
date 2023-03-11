import React from "react";

import { Box, CircularProgress, Typography } from "@mui/material";

import AlbumArt from "@components/UI/AlbumArt";
import Page from "@components/Page";
import Placeholder from "@components/Placeholder";

import { ButtonContainer, Content, Information, Root, Wrapper } from "@components/Page/ShrinkHeader.styles";

import { reverseLerp } from "@utils/math";

export interface ShrinkHeaderPageProps {
    loading?: false;
    title: string;
    image?: string;
    content: React.ReactNode;
    buttons: React.ReactNode;
    children: React.ReactNode;
}
export interface SkeletonShrinkHeaderPageProps {
    loading: true;
}
export interface ShrinkHeaderPageStates {}

type Props = ShrinkHeaderPageProps | SkeletonShrinkHeaderPageProps;

const MIN_ALBUM_ART_SIZE = 104;

export default class ShrinkHeaderPage extends React.Component<Props, ShrinkHeaderPageStates> {
    private readonly albumArtRef = React.createRef<HTMLDivElement>();
    private readonly informationRef = React.createRef<HTMLDivElement>();
    private albumArtHeight: number | null = null;
    private scrollY = 0;
    private frameId = 0;

    public componentDidMount() {
        this.frameId = window.requestAnimationFrame(this.handleFrame);
    }
    public componentWillUnmount() {
        window.cancelAnimationFrame(this.frameId);
    }

    private handleFrame = () => {
        this.frameId = window.requestAnimationFrame(this.handleFrame);
        if (!this.albumArtRef.current || !this.informationRef.current) {
            return;
        }

        if (this.albumArtHeight === null) {
            this.albumArtHeight = this.albumArtRef.current.clientHeight;
        }

        const size = Math.max(MIN_ALBUM_ART_SIZE, this.albumArtHeight - this.scrollY);
        const percent = reverseLerp(MIN_ALBUM_ART_SIZE, this.albumArtHeight, size);

        this.informationRef.current.style.opacity = `${1 - percent}`;

        this.albumArtRef.current.style.width = `${size}px`;
        this.albumArtRef.current.style.height = `${size}px`;
    };
    private handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        this.scrollY = e.currentTarget.scrollTop;
    };

    private renderSkeleton = () => {
        return (
            <Root>
                <AlbumArt size={208} />
                <Box flex="1 1 auto" display="flex" alignItems="center" justifyContent="center">
                    <CircularProgress />
                </Box>
            </Root>
        );
    };
    private renderHeader = () => {
        if (this.props.loading) {
            return this.renderSkeleton();
        }

        const { title, content, image, buttons } = this.props;

        return (
            <Wrapper>
                <Root>
                    <AlbumArt ref={this.albumArtRef} image={image} size={208} />
                    <Content>
                        <Typography variant="h4" noWrap overflow="hidden" fontWeight={800}>
                            {title}
                        </Typography>
                        <Information ref={this.informationRef}>{content}</Information>
                        <Placeholder />
                        <ButtonContainer>{buttons}</ButtonContainer>
                    </Content>
                </Root>
            </Wrapper>
        );
    };
    public render() {
        let content: React.ReactNode = null;
        if (!this.props.loading) {
            content = this.props.children;
        }

        return (
            <Page floatingHeader title="Album" header={this.renderHeader()} onScroll={this.handleScroll}>
                <Box pt={36} pb={2}>
                    {content}
                </Box>
            </Page>
        );
    }
}
