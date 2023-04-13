import styled from "@emotion/styled";

export const Root = styled.div`
    position: relative;
`;

export const EndAdornmentIcon = styled.div`
    margin-left: ${({ theme }) => theme.spacing(1)};

    display: flex;
    align-items: center;

    > svg {
        width: ${({ theme }) => theme.spacing(2.25)};
        height: ${({ theme }) => theme.spacing(2.25)};

        display: block;

        color: ${({ theme }) => theme.palette.text.secondary};
    }
`;
