import styled from "@emotion/styled";

export const Root = styled.button`
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 4px;

    display: flex;
    align-items: center;

    text-align: left;

    background-color: transparent;
    outline: none;

    &:not(:disabled) {
        &:hover {
            background-color: ${({ theme }) => theme.palette.action.hover};
        }

        &:active {
            background-color: ${({ theme }) => theme.palette.action.selected};
        }
    }
`;

export const AlbumArt = styled.div`
    width: 80px;
    height: 80px;

    border-radius: 4px;

    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;

    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.palette.divider};

    > img {
        width: 100%;

        display: block;
    }

    > svg {
        width: ${({ theme }) => theme.spacing(4)};
        height: ${({ theme }) => theme.spacing(4)};

        display: block;

        color: ${({ theme }) => theme.palette.text.disabled};
    }
`;

export const MetaData = styled.div`
    margin-left: ${({ theme }) => theme.spacing(1.5)};
    padding-right: ${({ theme }) => theme.spacing(1.5)};
`;

export const Separator = styled.div`
    width: ${({ theme }) => theme.spacing(0.25)};
    height: ${({ theme }) => theme.spacing(0.25)};

    border-radius: 50%;

    margin: 0 ${({ theme }) => theme.spacing(1)};

    background-color: ${({ theme }) => theme.palette.text.disabled};
`;
