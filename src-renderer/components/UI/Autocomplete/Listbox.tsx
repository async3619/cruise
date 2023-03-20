import React from "react";
import Scrollbars from "react-custom-scrollbars-2";

import { Root } from "@components/UI/Autocomplete/Listbox.styles";
import { mergeRefs } from "react-merge-refs";

export interface AutocompleteListboxProps {
    className?: string;
}

const AutocompleteListbox = React.forwardRef(
    ({ className: _, ...props }: AutocompleteListboxProps, ref: React.Ref<HTMLDivElement>) => {
        const [rootRef, setRootRef] = React.useState<HTMLDivElement | null>(null);
        const [scrollBarRef, setScrollBarRef] = React.useState<Scrollbars | null>(null);

        React.useEffect(() => {
            if (!rootRef || !scrollBarRef) {
                return;
            }

            Object.defineProperty(rootRef, "clientHeight", {
                get: () => scrollBarRef.getClientHeight(),
            });

            Object.defineProperty(rootRef, "scrollTop", {
                get: () => scrollBarRef.getScrollTop(),
                set: (value: number) => {
                    scrollBarRef.scrollTop(value);
                },
            });
        }, [rootRef, scrollBarRef]);

        return (
            <Scrollbars ref={setScrollBarRef} autoHeight autoHeightMax="40vh">
                <Root ref={mergeRefs([ref, setRootRef])} {...props} />
            </Scrollbars>
        );
    },
);

export default AutocompleteListbox;
