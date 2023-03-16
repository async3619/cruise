import styled from "@emotion/styled";

const IconButton = styled.button`
    width: ${({ theme }) => theme.spacing(4)};
    height: ${({ theme }) => theme.spacing(4)};

    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 4px;

    display: flex;
    align-items: center;
    justify-content: center;

    background: transparent;

    &:hover {
        background: rgba(0, 0, 0, 0.1);
    }

    &:active {
        background: rgba(0, 0, 0, 0.05);
    }

    > svg {
        display: block;
    }
`;

export default IconButton;
