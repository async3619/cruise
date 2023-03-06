import styled from "@emotion/styled";

export const Root = styled.table`
    width: 100%;

    margin: 0;

    border-collapse: separate;
    border-spacing: 0 ${({ theme }) => theme.spacing(0.75)};

    tr,
    td,
    th {
        border-spacing: 0;
    }
`;

export const Column = styled.td<{ shrink?: boolean; withoutPadding?: boolean }>`
    max-width: 0;

    padding: ${({ theme, withoutPadding }) => (withoutPadding ? 0 : theme.spacing(0, 1.5))};

    height: ${({ theme }) => theme.spacing(6)};

    > p {
        display: block;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        text-align: ${({ shrink }) => (shrink ? "right" : "left")};
    }

    &:first-of-type {
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
    }

    &:last-of-type {
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
    }

    tr:hover & {
        background: #f0f0f0 !important;
        border-color: #eaeaea !important;
    }

    tr:nth-of-type(odd) & {
        background: white;
        border: 1px solid #eaeaea;
        border-left: 0;
        border-right: 0;

        &:first-of-type {
            border-left: 1px solid #eaeaea;
        }

        &:last-of-type {
            border-right: 1px solid #eaeaea;
        }
    }
`;

export const Controls = styled.div`
    display: flex;
    justify-content: center;

    opacity: 0;
`;

export const Row = styled.tr<{ active?: boolean }>`
    ${Column} {
        color: ${({ active, theme }) => (active ? theme.palette.primary.main : "inherit")};
    }

    ${Controls} {
        opacity: ${({ active }) => (active ? 1 : 0)};
    }

    &:hover {
        ${Controls} {
            opacity: 1;
        }
    }
`;
