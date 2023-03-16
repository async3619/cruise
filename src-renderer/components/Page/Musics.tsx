import React from "react";

import { Box, Typography } from "@mui/material";
import ShuffleIcon from "@mui/icons-material/Shuffle";

import Button from "@components/UI/Button";
import Page from "@components/Page";

import withClient, { WithClientProps } from "@graphql/withClient";
import { WithPlayerProps } from "@player/withPlayer";

import { MusicsQuery, MusicsDocument } from "@queries";

import { Root } from "@components/Page/Musics.styles";

export interface MusicsPageProps extends WithClientProps, WithPlayerProps {
    title: string;
    children: React.ReactNode;
}
export interface MusicsPageStates {
    playAllShuffledProcessing: boolean;
}

class MusicsPage extends React.Component<MusicsPageProps, MusicsPageStates> {
    public state: MusicsPageStates = {
        playAllShuffledProcessing: false,
    };

    private handleShuffleAllClick = async () => {
        this.setState({ playAllShuffledProcessing: true });

        const { data } = await this.props.client.query<MusicsQuery>({
            query: MusicsDocument,
        });

        await this.props.player.playShuffled(data.musics);
        this.setState({ playAllShuffledProcessing: false });
    };

    private renderHeader = (title: string) => {
        const { playAllShuffledProcessing } = this.state;

        return (
            <Root>
                <Typography variant="h4" lineHeight={1}>
                    {title}
                </Typography>
                <Box mt={4} mb={2}>
                    <Button
                        color="primary"
                        icon={ShuffleIcon}
                        onClick={this.handleShuffleAllClick}
                        disabled={playAllShuffledProcessing}
                    >
                        Play All Shuffled
                    </Button>
                </Box>
            </Root>
        );
    };
    public render() {
        const { title, children } = this.props;

        return (
            <Page title={title} header={this.renderHeader(title)}>
                {children}
            </Page>
        );
    }
}

export default withClient(MusicsPage);
