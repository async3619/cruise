import styled from "@emotion/styled";

export const NormalRoot = styled.button<{ open: boolean }>`
    width: 100%;
    height: ${({ theme }) => theme.spacing(4)};

    margin: 0;
    padding: ${({ theme }) => theme.spacing(0, 1.5)};
    border: 0;

    position: relative;
    display: flex;
    align-items: center;

    font-size: 0.95rem;

    background: transparent;

    outline: none;
`;

export const OutlineRoot = styled(NormalRoot)`
    &:hover {
        background: #fcfcfc;
    }

    &:active {
        background: #fcfcfc;
    }
`;

export const Graphics = styled.div<{ open: boolean }>`
    border-radius: 4px;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    pointer-events: none;
`;

export const NormalGraphics = styled(Graphics)`
    ${NormalRoot}:hover & {
        border: 1px solid #eaeaea;
        border-bottom-color: #d1d1d1;
    }
`;

export const OutlineGraphics = styled(Graphics)`
    border: 1px solid #f0f0f0;
    border-bottom-color: ${({ open, theme }) => (open ? theme.palette.primary.main : "#8d8d8d")};
    border-bottom-width: ${({ open }) => (open ? "2px" : "1px")};
    border-bottom-left-radius: ${({ open }) => (open ? "0" : "4px")};
    border-bottom-right-radius: ${({ open }) => (open ? "0" : "4px")};

    ${OutlineRoot}:active & {
        border-bottom-color: ${({ theme, open }) => (open ? theme.palette.primary.main : "#f0f0f0")};
    }
`;

export const Icon = styled.div`
    position: absolute;
    top: 50%;
    right: ${({ theme }) => theme.spacing(1)};

    transform: translateY(-50%);

    > svg {
        display: block;

        color: #6c6c6c;
    }
`;
