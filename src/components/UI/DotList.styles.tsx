import styled from "@emotion/styled";

export const Root = styled.div`
    margin: 0;
    padding: 0;

    display: flex;
`;

export const ItemLabel = styled.span`
    margin-right: 0.5em !important;

    display: block;

    &:not(:last-of-type) {
        &:after {
            content: "•";

            margin-left: 0.5em;

            display: inline-block;
        }
    }
`;
