import styled from "@emotion/styled";

export const Root = styled.div`
    margin: 0;
    padding: 0;
`;

export const ListItem = styled.div<{ active?: boolean }>`
    margin: ${({ theme }) => theme.spacing(0, 0, 0.5)};
    padding: 0;
    border-radius: 4px;

    display: flex;
    align-items: center;

    outline: none;
    padding-right: ${({ theme }) => theme.spacing(1)};

    background-color: ${({ theme, active }) => (active ? theme.palette.action.selected : "transparent")};

    &:last-of-type {
        margin-bottom: 0;
    }

    &:hover,
    &:focus {
        background-color: ${({ theme }) => theme.palette.action.hover};
    }

    &:active {
        background-color: ${({ theme }) => theme.palette.action.selected};
    }
`;

export const AlbumArtWrapper = styled.div`
    width: ${({ theme }) => theme.spacing(8)};
    height: ${({ theme }) => theme.spacing(8)};

    margin-right: ${({ theme }) => theme.spacing(1)};

    flex: 0 0 ${({ theme }) => theme.spacing(8)};
`;

export const Description = styled.div`
    min-width: 0;

    p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

export const TrackList = styled.div`
    table {
        width: 100%;
        padding: 0;

        td,
        th,
        table {
            border: none;
            padding: 0;
            border-spacing: 0;
        }

        td {
            vertical-align: top;

            &:first-of-type {
                width: 1%;
            }
        }

        tr:not(:last-of-type) {
            td {
                padding-bottom: ${({ theme }) => theme.spacing(1)};
            }
        }
    }
`;
