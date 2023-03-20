import styled from "@emotion/styled";

export const Root = styled.input`
    margin: 0;
    padding: 0 calc(${({ theme }) => theme.spacing(1.5)});
    border: 0;

    flex: 1 1 auto;

    outline: none;
    background: transparent;

    label > & {
        margin-top: ${({ theme }) => theme.spacing(0.5)};
    }
`;

export const FullWidthRoot = styled(Root)`
    width: 100%;
`;

export const Wrapper = styled.div<{ withAdornment: boolean }>`
    min-height: ${({ theme }) => theme.spacing(4)};

    padding: ${({ theme, withAdornment }) => theme.spacing(withAdornment ? 0.75 : 0, 0)};
    margin: ${({ theme }) => theme.spacing(0.5, 0, 0)};

    display: flex;
    align-items: center;
    flex-wrap: wrap;
    position: relative;

    background: white;
    outline: none;
`;

export const Graphics = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    pointer-events: none;
`;

export const Label = styled.label<{ error?: boolean; open?: boolean }>`
    display: block;

    p {
        color: ${({ error, theme }) =>
            error ? `${theme.palette.error.main} !important` : theme.palette.text.secondary};
    }

    &:focus-within {
        p {
            color: ${({ theme }) => theme.palette.primary.main};
        }

        ${Graphics} {
            border-bottom-color: ${({ theme }) => theme.palette.primary.main};
            border-bottom-width: 2px;
        }
    }

    &:hover {
        ${Wrapper} {
            background: #fcfcfc;
        }
    }

    ${Graphics} {
        border: 1px solid;
        border-color: ${({ error, theme }) => (error ? `${theme.palette.error.light} !important` : "#f0f0f0")};
        border-bottom-color: ${({ error, theme }) => (error ? `${theme.palette.error.dark} !important` : "#8d8d8d")};
        border-radius: 4px 4px ${({ open }) => (open ? "0" : "4px")} ${({ open }) => (open ? "0" : "4px")};
    }
`;

export const FullWidthLabel = styled(Label)`
    width: 100%;
`;

export const InputWrapper = styled.div`
    height: ${({ theme }) => theme.spacing(4)};

    display: flex;
    align-items: center;
    flex: 1 1 auto;
`;

export const EndAdornment = styled.div`
    padding: ${({ theme }) => theme.spacing(0, 1.5)};
`;
