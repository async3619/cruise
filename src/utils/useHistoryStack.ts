import React from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function useHistoryStack() {
    const [stack, setStack] = React.useState<string[]>([]);
    const { pathname } = useLocation();
    const type = useNavigationType();

    React.useEffect(() => {
        if (type === "POP") {
            setStack(prev => prev.slice(0, prev.length - 1));
        } else if (type === "PUSH") {
            setStack(prev => [...prev, pathname]);
        } else {
            setStack(prev => [...prev.slice(0, prev.length - 1), pathname]);
        }
    }, [pathname, type]);

    return stack;
}
