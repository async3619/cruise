import { Virtualizer } from "@tanstack/react-virtual";

interface Rect {
    width: number;
    height: number;
}

export const observeOffset = (instance: Virtualizer<Window, any>, cb: (offset: number) => void) => {
    const element = instance.scrollElement;
    if (!element) {
        return;
    }

    const handler = () => {
        cb(element[instance.options.horizontal ? "scrollX" : "scrollY"]);
    };
    handler();

    element.addEventListener("scroll", handler, {
        passive: true,
    });

    return () => {
        element.removeEventListener("scroll", handler);
    };
};

export const observeRect = (instance: Virtualizer<Window, any>, cb: (rect: Rect) => void) => {
    const element = instance.scrollElement;
    if (!element) {
        return;
    }

    const handler = () => {
        cb({ width: element.innerWidth, height: element.innerHeight });
    };
    handler();

    element.addEventListener("resize", handler, {
        passive: true,
    });

    return () => {
        element.removeEventListener("resize", handler);
    };
};
