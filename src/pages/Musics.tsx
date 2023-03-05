import React from "react";

import Page from "@components/Page";

import { useMusicsQuery } from "@queries";

import { Root } from "@pages/Musics.styles";

export default function Musics() {
    const { data } = useMusicsQuery();

    return (
        <Page title="Musics">
            <Root>
                <span>{data?.musics?.length}</span>
            </Root>
        </Page>
    );
}
