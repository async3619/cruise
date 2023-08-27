import styled from "@emotion/styled";

export const Root = styled.div`
    width: ${({ theme }) => theme.spacing(70)};

    margin: 0;
    padding: 0;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const Time = styled.span`
    font-family: "Roboto Mono", monospace !important;

    color: ${({ theme }) => theme.vars.palette.text.disabled};

    &:first-of-type {
        text-align: left;
    }

    &:last-of-type {
        text-align: right;
    }
`;
