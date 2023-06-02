import styled from "@emotion/styled";
import { backgroundColors } from "@styles/theme";

export const Root = styled.div`
    height: ${({ theme }) => theme.spacing(11)};

    margin: 0;
    padding: ${({ theme }) => theme.spacing(0, 2)};
    border-top: 1px solid ${({ theme }) => theme.vars.palette.divider};

    display: flex;

    ${({ theme }) => theme.getColorSchemeSelector("dark")} {
        background: ${backgroundColors["950"]};
    }
`;

export const Controls = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing(0.5)};

    display: flex;
    align-items: center;

    > button {
        margin: ${({ theme }) => theme.spacing(0, 0.5)};
    }
`;

export const NowPlaying = styled.div`
    min-width: 0;

    display: flex;
    align-items: center;
    flex: 1 1;
`;

export const AlbumArt = styled.div`
    width: ${({ theme }) => theme.spacing(7)};
    height: ${({ theme }) => theme.spacing(7)};

    margin-right: ${({ theme }) => theme.spacing(1.5)};
    border-radius: 4px;

    flex: 0 0 ${({ theme }) => theme.spacing(7)};

    background-size: cover;
    background-position: center;
`;

export const Information = styled.div`
    min-width: 0;

    display: flex;
    flex-direction: column;
`;
