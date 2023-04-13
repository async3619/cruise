import React from "react";
import { useNavigate } from "react-router-dom";

import Button, { ButtonProps } from "@components/UI/Button";

export interface LinkButtonProps extends ButtonProps {
    href: string;
}

export default function LinkButton({ children, href, onClick, ...rest }: LinkButtonProps) {
    const navigate = useNavigate();
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick) {
            onClick(event);
        }

        if (event.defaultPrevented) {
            return;
        }

        navigate(href);
    };

    return (
        <Button {...rest} onClick={handleClick}>
            {children}
        </Button>
    );
}
