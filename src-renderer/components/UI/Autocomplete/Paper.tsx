import React from "react";

import { Root } from "@components/UI/Autocomplete/Paper.styles";

export interface AutocompletePaperProps extends React.HTMLAttributes<HTMLElement> {}

const AutocompletePaper = React.forwardRef(
    ({ children, ...rest }: AutocompletePaperProps, ref: React.Ref<HTMLDivElement>) => (
        <Root ref={ref} {...rest}>
            {children}
        </Root>
    ),
);

export default AutocompletePaper;
